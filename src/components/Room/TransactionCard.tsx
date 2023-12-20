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

const TransactionCard = ({
  fromUser,
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
  const [isLoading, setIsLoading] = useState(false);
  const approveTrnx = async (trnxId: string) => {
    setIsLoading(true);
    const resp = await supabase
      ?.from("transactions")
      .update({ approved: true })
      .eq("id", trnxId);
    if (resp?.error) {
      setIsLoading(false);
      return;
    }

    // const updateMasterSheet = await supabase
    //   ?.from("rooms")
    //   .update({ master_sheet: {} })
    //   .eq("id", currentRoomData?.id);
    // // TODO:
    // // recalculate master sheet in room

    setIsLoading(false);
  };

  const avatarText = fromUser?.name
    .toUpperCase()
    .split(" ")
    .map((c) => c[0])
    .toString();
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
        <Avatar>
          {avatarText !== "_" && (
            <Typography color="white">{avatarText}</Typography>
          )}
        </Avatar>
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
          color={trnx.type === "Pay" ? "lightgreen" : "#FF6961"}
        >
          Rs {trnx.amount}
        </Typography>
        {trnx.approved ? (
          <DoneAll sx={{ fontSize: "18px", opacity: 0.6 }} />
        ) : (
          <Close sx={{ fontSize: "18px", opacity: 0.6 }} />
        )}
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
      </Box>
    </Card>
  );
};

export default TransactionCard;
