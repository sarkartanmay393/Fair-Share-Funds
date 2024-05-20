import { useState } from "react";
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

import { MasterStatement, Statement } from "@/utils/masterSheet.ts";
import supabase from "@/utils/supabase/supabase.ts";

interface Props {
  roomId: string;
  masterSheet: MasterStatement;
  fromUserData?: UserData;
  toUserDataSelf?: boolean;
  roomUsers: UserData[];
  transaction: Transaction;
}

const TransactionCard = ({
  roomId,
  masterSheet,
  toUserDataSelf,
  roomUsers,
  transaction,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const approveTrnx = async (transactionId: string) => {
    setIsLoading(true);
    const resp = await supabase
      .from("transactions")
      .update({ approved: true })
      .eq("id", transactionId);
    if (resp?.error) {
      alert("Approval failed");
      setIsLoading(false);
      return;
    }

    setTimeout(async () => {
      const ms = masterSheet;
      const fromUserDataStatement =
        ms?.getStatement(transaction?.from_user) || new Statement();
      const toUserDataStatement =
        ms?.getStatement(transaction.to_user) || new Statement();

      const fus_tua =
        Number(fromUserDataStatement?.getAmount(transaction.to_user) || 0) +
        transaction.amount;
      fromUserDataStatement?.setAmount(transaction.to_user, fus_tua + "");
      const tus_fua =
        Number(toUserDataStatement?.getAmount(transaction.from_user) || 0) +
        transaction.amount;
      toUserDataStatement?.setAmount(transaction.from_user, tus_fua + "");

      const updateMasterSheet = await supabase
        ?.from("rooms")
        .update({ master_sheet: ms?.toJson() })
        .eq("id", roomId);

      if (updateMasterSheet?.error) {
        alert("Failed master sheet update");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    }, 200);
  };

  const transactionBy = roomUsers.find(
    (u) => u.id === transaction.from_user
  )?.name;
  const transactionTo = roomUsers.find(
    (u) => u.id === transaction.to_user
  )?.name;

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
        <Avatar>{(transactionBy ?? "Noname").trim().charAt(0)}</Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "15px" }}>
            {transactionBy ?? "Noname"}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            {transaction.type === "Pay" ? "Paid" : "Borrowed"}{" "}
            <span style={{ fontWeight: 600 }}>{transactionTo ?? "Noname"}</span>
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
            onClick={() => approveTrnx(transaction.id)}
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
