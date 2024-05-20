/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { SxProps, Theme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Room, Transaction, UserData } from "@/interfaces/index.ts";
import { useStoreState } from "@/store/typedHooks.ts";
import supabase from "@/utils/supabase/supabase.ts";

interface InputProps {
  styles?: SxProps<Theme>;
  usersId?: string[];
  roomUsers: UserData[];
  roomData: Room;
}

export default function InputBar({ roomData, roomUsers }: InputProps) {
  const { user } = useStoreState((state) => state);
  const [, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const sendTransaction = async (
    newTransaction: Transaction,
    resetForm: any
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .insert(newTransaction)
        .select()
        .single();

      if (error) {
        // setError(resp.error.message);
        throw error;
      }

      const updatedTransactionIds = [
        ...(roomData?.transactions_id ?? []),
        data.id,
      ];

      const updateRoomResp = await supabase
        .from("rooms")
        .update({
          transactions_id: updatedTransactionIds,
        })
        .eq("id", roomData.id);

      if (updateRoomResp && updateRoomResp.error) {
        throw updateRoomResp.error;
      }

      setLoading(false);
      resetForm();
    } catch (e) {
      setLoading(false);
      setError(String(e));
    }
  };

  const useTransactionInputFormik = useFormik({
    initialValues: { toUser: "self", transactionType: "Pay", amount: "" },
    validationSchema: Yup.object().shape({
      toUser: Yup.string().min(8).required(),
      amount: Yup.number().moreThan(0, "amount must > 0"),
    }),
    // enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        setError("");
        if (values.toUser === user?.id) {
          resetForm();
          return;
        }
        const newTransaction = {
          amount: Number(values.amount),
          from_user: user?.id,
          room_id: roomData?.id,
          to_user: values.toUser,
          type: values.transactionType,
        } as Transaction;

        if (newTransaction.type === "Due") {
          newTransaction.amount = -newTransaction.amount;
        }

        sendTransaction(newTransaction, resetForm);
        setSubmitting(false);
      }, 200);
    },
  });

  return (
    <Box
      component="form"
      position="fixed"
      bottom={10}
      borderRadius={20}
      height="64px"
      width={{ xs: "95%" }}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="background.paper"
      onSubmit={useTransactionInputFormik.handleSubmit}
    >
      <Box
        flex={1}
        display="flex"
        justifyContent={{ xs: "space-evenly", md: "flex-start" }}
        alignItems="center"
        ml={{ xs: 1.25, md: 2 }}
      >
        <Select
          disableUnderline
          variant="standard"
          size="small"
          id="to-user-select"
          name="toUser"
          value={useTransactionInputFormik.values.toUser}
          onChange={useTransactionInputFormik.handleChange}
          sx={{ mr: { xs: 0.5, md: 2 } }}
        >
          {roomUsers &&
            roomUsers.map(
              (ru) =>
                ru.id !== user?.id && (
                  <MenuItem
                    sx={{ border: 0 }}
                    key={ru.id.slice(0, 3)}
                    value={ru.id === user?.id ? "self" : ru.id!}
                  >
                    <Avatar>
                      <Typography color="white">
                        {ru.id === user?.id
                          ? "-"
                          : ru.name &&
                            `${ru.name.split(" ").at(0)?.at(0)}${ru.name
                              .split(" ")
                              .at(1)
                              ?.at(0)}`}
                      </Typography>
                    </Avatar>
                  </MenuItem>
                )
            )}
          <MenuItem value={"self"}>
            <Avatar>
              <Typography color="white">{"-"}</Typography>
            </Avatar>
          </MenuItem>
        </Select>
        <Select
          variant="outlined"
          size="small"
          id="transaction-type-select"
          name="transactionType"
          value={useTransactionInputFormik.values.transactionType}
          onChange={useTransactionInputFormik.handleChange}
          sx={{ outline: 0, border: 0 }}
        >
          <MenuItem value="Pay">
            <Typography color="white">Pay</Typography>
          </MenuItem>
          <MenuItem value="Due">
            <Typography color="white">Due</Typography>
          </MenuItem>
        </Select>
        <TextField
          required
          type="number"
          size="small"
          name="amount"
          label="Amount"
          variant="outlined"
          value={useTransactionInputFormik.values.amount}
          onChange={useTransactionInputFormik.handleChange}
          sx={{ width: "100%", padding: "0px", ml: { xs: 0.5, md: 1 } }}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="end"
        pl={{ xs: 1, md: 2 }}
        mr={{ md: 2 }}
      >
        <IconButton
          disabled={useTransactionInputFormik.isSubmitting}
          type="submit"
          sx={{}}
        >
          {loading ? <CircularProgress /> : <Send sx={{ fontSize: "22px" }} />}
        </IconButton>
      </Box>
    </Box>
  );
}
