import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Transaction, UserData } from "../../interfaces/index.ts";

import { Done, DoneAll, Close } from "@mui/icons-material";

import supabase from "@/utils/supabase/supabase.ts";

interface Props {
  fromUserData?: UserData;
  toUserDataSelf?: boolean;
  transaction: Transaction;
}

const TransactionCard = ({ toUserDataSelf, transaction }: Props) => {
  // const pathname = window.location.pathname;
  // const roomId = pathname.split("/")[2];

  const [isLoading, setIsLoading] = useState(false);

  const approveTransaction = async (transactionId: string) => {
    setIsLoading(true);

    const { data: statementData, error: statementError } = await supabase
      .from("statements")
      .select("amount")
      .eq("roomId", transaction.room_id)
      .in("between", [transaction.from_user, transaction.to_user])
      .single();

    if (statementError) {
      console.log(statementError.message);
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("statements")
      .update({ amount: statementData.amount + transaction.amount })
      .eq("roomId", transaction.room_id)
      .in("between", [transaction.from_user, transaction.to_user]);

    if (error) {
      console.log(error.message);
      setIsLoading(false);
      return;
    }

    const { error: errorTransactionUpdate } = await supabase
      .from("transactions")
      .update({ approved: true })
      .eq("id", transactionId);

    if (errorTransactionUpdate) {
      console.log(errorTransactionUpdate.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const [sendBy, setSendBy] = useState("");
  const [sentTo, setSentTo] = useState("");

  useEffect(() => {
    const loadSendersNames = async () => {
      try {
        const { data } = await supabase
          .from("users")
          .select(`name`)
          .eq("id", transaction.from_user)
          .single();

        setSendBy(data?.name);

        const { data: data2 } = await supabase
          .from("users")
          .select(`name`)
          .eq("id", transaction.to_user)
          .single();

        setSentTo(data2?.name);
      } catch (error) {
        console.log(error);
      }
    };

    loadSendersNames();
  }, []);

  return (
    <Card
      sx={{
        // mb: "6px",
        width: "95%",
        // mx: '2rem',
        height: "64px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "background.default",
        borderRadius: "8px",
        paddingX: "15px",
      }}
    >
      <Box sx={{ display: "flex", gap: "18px" }} border="px solid red">
        <Avatar>{(sendBy ?? "Noname").trim().charAt(0)}</Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "15px" }}>
            {sendBy ?? "Noname"}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            {transaction.type === "Pay" ? "Paid" : "Borrowed"}{" "}
            <span style={{ fontWeight: 600 }}>{sentTo ?? "Noname"}</span>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", columnGap: 2 }}>
        <Typography
          sx={{ fontSize: "15px", fontWeight: "600" }}
          color={transaction.type === "Pay" ? "lightgreen" : "#FF6966"}
        >
          Rs. {transaction.amount}
        </Typography>
        {transaction.approved && (
          <DoneAll sx={{ fontSize: "18px", opacity: 0.6 }} />
        )}
        {toUserDataSelf && !transaction.approved && (
          <Button
            disableRipple
            disabled={transaction.approved || false}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "green",
            }}
            onClick={() => approveTransaction(transaction.id)}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Done sx={{ fontSize: "18px" }} />
            )}
          </Button>
        )}
        {!toUserDataSelf && !transaction.approved && (
          <Close sx={{ fontSize: "18px", opacity: 0.6 }} />
        )}
      </Box>
    </Card>
  );
};

export default TransactionCard;
