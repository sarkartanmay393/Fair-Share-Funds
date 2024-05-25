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

export default function TransactionInputBar({
  roomData,
  roomUsers,
}: InputProps) {
  const { user } = useStoreState((state) => state);
  const [, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const sendTransaction = async (
    newTransaction: Transaction,
    resetForm: any
  ) => {
    // Generating (because a transaction is powerful, it must get generated on client side not supabase)
    const newTransactionId = crypto.randomUUID();

    try {
      if (!roomData) {
        resetForm();
        return;
      }

      setLoading(true);
      console.log("Sending Transactions");

      const { data: newTransactionData, error } = await supabase
        .from("transactions")
        .insert({ ...newTransaction, id: newTransactionId })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("sending broadcast");
      await supabase.channel(`${roomData.id}`).send({
        type: "broadcast",
        event: "incoming-transaction",
        payload: { ...newTransactionData },
      });

      const updatedTransactionIds = [
        ...roomData.transactions_id,
        newTransaction.id,
      ];

      console.log("Updating Room Data");
      const { error: updateRoomError } = await supabase
        .from("rooms")
        .update({
          transactions_id: updatedTransactionIds,
        })
        .eq("id", roomData.id);

      if (updateRoomError) {
        throw updateRoomError;
      }

      console.log("Updated Room Data!");
      console.log("Sent Transactions");
      setLoading(false);
      resetForm();
    } catch (e) {
      console.error("Transaction failed", e);

      // Rollback logic (manual handling)
      // Delete the new transaction
      await supabase.from("transactions").delete().eq("id", newTransactionId);

      // Rollback room data update if necessary
      const { error: rollbackError } = await supabase
        .from("rooms")
        .update({ transactions_id: roomData.transactions_id })
        .eq("id", roomData.id);

      if (rollbackError) {
        console.error("Rollback failed", rollbackError);
      } else {
        console.log("Rollback succeeded");
      }

      console.log("Failed to send Transactions");
      setLoading(false);
      console.log(e);
      setError(String(e));
    }
  };

  const useTransactionInputFormik = useFormik({
    initialValues: {
      toUser: "",
      transactionType: "Pay",
      amount: "",
    },
    validationSchema: Yup.object().shape({
      toUser: Yup.string().min(8).required(),
      amount: Yup.number().moreThan(0, "amount must > 0"),
    }),
    // enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setError("");
      // if (values.toUser === user?.id) {
      //   resetForm();
      //   return;
      // }

      if (!roomData) {
        console.log("not roomData");
        resetForm();
        return;
      }

      const newTransaction = {
        amount: Number(values.amount),
        from_user: user?.id,
        room_id: roomData.id,
        to_user: values.toUser,
        type: values.transactionType,
        approved: false,
      } as Transaction;

      if (newTransaction.type === "Due") {
        newTransaction.amount = -newTransaction.amount;
      }

      console.log("sending");
      sendTransaction(newTransaction, resetForm);
      setSubmitting(false);
    },
  });

  React.useEffect(() => {
    if (!useTransactionInputFormik.values.toUser.length) {
      if (roomUsers.length > 1) {
        const anyOtherUser = roomUsers.find((ru) => ru.id !== user?.id);
        useTransactionInputFormik.setValues((p) => {
          return { ...p, toUser: anyOtherUser?.id ?? roomUsers[0].id };
        });
      }
    }
  }, [roomUsers, useTransactionInputFormik.values.toUser]);

  return (
    <Box
      id="trxnInput"
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
            roomUsers.map((ru) =>
              ru.id === user?.id ? null : (
                <MenuItem
                  sx={{ border: 0 }}
                  key={ru.id.slice(0, 3)}
                  value={ru.id}
                >
                  <Avatar>
                    <Typography color="white">
                      {ru.name.trim().charAt(0)}
                    </Typography>
                  </Avatar>
                </MenuItem>
              )
            )}
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
