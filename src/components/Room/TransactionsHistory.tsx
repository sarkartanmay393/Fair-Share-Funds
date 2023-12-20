import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { User } from "../../interfaces/index.ts";

import { Done, DoneAll, Close } from "@mui/icons-material";

import { useSupabaseContext } from "../../provider/supabase/useSupabase.ts";
import { useCurrentRoomData } from "../../utils/useCurrentRoomData.ts";
import { Transaction } from "../../interfaces/index.ts";

const TransactionsHistory = ({
  roomUsers,
  roomId,
}: {
  roomUsers?: User[];
  roomId: string;
}) => {
  const { session, supabase } = useSupabaseContext();
  const { currentTransactions } = useCurrentRoomData(roomId);
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

  return (
    <Box
      width="100%"
      height="calc(100vh - 64px)"
      paddingX={1}
      border="px solid green"
    >
      <List
        sx={{
          overflowY: "scroll",
          height: "100%",
        }}
      >
        {currentTransactions?.map((trnx: Transaction) => {
          const fromUser = roomUsers?.find((u) => u.id === trnx.from_user);
          const toUserSelf = session?.user.id === trnx.to_user;
          return (
            <ListItem sx={{ width: "100%" }}>
              <Card
                key={trnx.id.slice(0, 3)}
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
                <Box
                  sx={{ display: "flex", gap: "18px" }}
                  border="px solid red"
                >
                  <Avatar>
                    <Typography color="white">
                      {`${fromUser?.name
                        .split(" ")
                        .at(0)
                        ?.at(0)}${fromUser?.name.split(" ").at(1)?.at(0)}`}
                    </Typography>
                  </Avatar>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography sx={{ fontSize: "15px" }}>
                      {roomUsers?.find((u) => u.id === trnx.from_user)?.name}
                    </Typography>
                    <Typography sx={{ fontSize: "12px" }}>
                      {trnx.type === "Pay" ? "Paid" : "Borrowed"}{" "}
                      <span style={{ fontWeight: 600 }}>
                        {roomUsers?.find((u) => u.id === trnx.to_user)?.name}
                      </span>
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", columnGap: 2 }}
                >
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
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default TransactionsHistory;
