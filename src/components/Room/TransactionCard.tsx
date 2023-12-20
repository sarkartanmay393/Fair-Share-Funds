import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Transaction, User } from "../../interfaces/index.ts";

import { Done, DoneAll, Close } from "@mui/icons-material";

import { useSupabaseContext } from "../../provider/supabase/useSupabase.ts";
import { useCurrentRoomData } from "@/utils/useCurrentRoomData.ts";
import { Statement } from "@/utils/masterSheet.ts";

const TransactionCard = ({
  toUserSelf,
  roomUsers,
  trnx,
}: {
  fromUser?: User;
  toUserSelf?: boolean;
  roomUsers?: User[];
  trnx: Transaction;
}) => {
  const { supabase } = useSupabaseContext();
  const { currentRoomData } = useCurrentRoomData(trnx.room_id);
  const [isLoading, setIsLoading] = useState(false);
  const approveTrnx = async (trnxId: string) => {
    setIsLoading(true);

    const resp = await supabase
      ?.from("transactions")
      .update({ approved: true })
      .eq("id", trnxId);
    if (resp?.error) {
      alert("Approval failed");
      setIsLoading(false);
      return;
    }

    const ms = currentRoomData?.master_sheet;
    const fromUserStatement =
      ms?.getStatement(trnx?.from_user) || new Statement();
    const toUserStatement = ms?.getStatement(trnx.to_user) || new Statement();

    const fus_tua =
      Number(fromUserStatement?.getAmount(trnx.to_user) || 0) + trnx.amount;
    fromUserStatement?.setAmount(trnx.to_user, fus_tua + "");
    const tus_fua =
      Number(toUserStatement?.getAmount(trnx.from_user) || 0) + trnx.amount;
    toUserStatement?.setAmount(trnx.from_user, tus_fua + "");

    const updateMasterSheet = await supabase
      ?.from("rooms")
      .update({ master_sheet: ms?.toJson() })
      .eq("id", currentRoomData?.id);

    if (updateMasterSheet?.error) {
      alert("Failed master sheet update");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  const trnxBy = roomUsers?.find((u) => u.id === trnx.from_user)?.name;
  const trnxTo = roomUsers?.find((u) => u.id === trnx.to_user)?.name;

  return (
    <Card
      sx={{
        // mb: "6px",
        width: "100%",
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
        <Avatar>{(trnxBy ?? "Noname").trim().charAt(0)}</Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "15px" }}>
            {trnxBy ?? "Noname"}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            {trnx.type === "Pay" ? "Paid" : "Borrowed"}{" "}
            <span style={{ fontWeight: 600 }}>{trnxTo ?? "Noname"}</span>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", columnGap: 2 }}>
        <Typography
          sx={{ fontSize: "15px", fontWeight: "600" }}
          color={trnx.type === "Pay" ? "lightgreen" : "#FF6966"}
        >
          Rs. {trnx.amount}
        </Typography>
        {trnx.approved && <DoneAll sx={{ fontSize: "18px", opacity: 0.6 }} />}
        {toUserSelf && !trnx.approved && (
          <Button
            disableRipple
            disabled={trnx.approved || false}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "green",
            }}
            onClick={() => approveTrnx(trnx.id)}
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Done sx={{ fontSize: "18px" }} />
            )}
          </Button>
        )}
        {!toUserSelf && !trnx.approved && (
          <Close sx={{ fontSize: "18px", opacity: 0.6 }} />
        )}
      </Box>
    </Card>
  );
};

export default TransactionCard;
