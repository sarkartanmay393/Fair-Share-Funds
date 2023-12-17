import * as React from "react";
import { SxProps, Theme, styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import { Avatar, Box, IconButton, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Database } from "../../utils/supabase/types";
import { useSupabaseContext } from "../../provider/supabase/provider";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

interface InputProps {
  styles?: SxProps<Theme>;
  usersId?: string[];
  roomUsers?: Database["public"]["Tables"]["users"]["Row"][];
  roomData?: Database["public"]["Tables"]["rooms"]["Row"];
}

export default function InputBar({ roomData, roomUsers }: InputProps) {
  const { supabase, session } = useSupabaseContext();
  const [error, setError] = React.useState("");

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
        if (values.toUser === session?.user.id) {
          resetForm();
          return;
        }
        const newTransaction = {
          amount: Number(values.amount),
          from_user: session?.user.id,
          room_id: roomData?.id,
          to_user: values.toUser,
          type: values.transactionType,
        } as Database["public"]["Tables"]["transactions"]["Row"];
        const sendTransaction = async () => {
          try {
            const resp = await supabase
              ?.from("transactions")
              .insert(newTransaction)
              .select()
              .single();
            if (resp && resp.error) {
              setError(resp.error.message);
              return;
            }

            const updateRoomResp = await supabase
              ?.from("rooms")
              .update({
                transactions_id: [
                  ...(roomData?.transactions_id || []),
                  resp?.data.id,
                ],
              })
              .eq("id", roomData?.id);
            if (updateRoomResp && updateRoomResp.error) {
              setError(updateRoomResp.error.message);
              return;
            }

            resetForm();
          } catch (e) {
            setError(String(e));
          }
        };

        sendTransaction();
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
                ru.id !== session?.user.id && (
                  <MenuItem
                    sx={{ border: 0 }}
                    key={ru.id.slice(0, 3)}
                    value={ru.id === session?.user.id ? "self" : ru.id!}
                  >
                    <Avatar>
                      <Typography color="white">
                        {ru.id === session?.user.id
                          ? "-"
                          : ru.name &&
                            `${ru.name.split(" ").at(0)?.at(0)}${ru.name
                              .split(" ")
                              .at(1)
                              ?.at(0)}`}
                      </Typography>
                    </Avatar>
                  </MenuItem>
                ),
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
          placeholder={useTransactionInputFormik.values.amount}
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
          <Send sx={{ fontSize: "22px" }} />
        </IconButton>
      </Box>
    </Box>
  );
}
