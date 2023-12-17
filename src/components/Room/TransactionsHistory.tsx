import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Room, Transaction, User } from "../../interfaces";

import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import { useSupabaseContext } from "../../provider/supabase/provider";

const TransactionsHistory = ({
  transactions,
  roomUsers,
  currentRoomData,
}: {
  transactions?: Transaction[];
  roomUsers?: User[];
  currentRoomData?: Room;
}) => {
  const { session, supabase } = useSupabaseContext();
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

    const updateMasterSheet = await supabase
      ?.from("rooms")
      .update({ master_sheet: {} })
      .eq("id", currentRoomData?.id);
    // TODO:
    // recalculate master sheet in room

    setIsLoading(false);
  };

  return (
    <>
      {transactions &&
        transactions.map((trnx, index) => {
          const fromUser = roomUsers?.find((u) => u.id === trnx.from_user);
          const toUserSelf = session?.user.id === trnx.to_user;

          return (
            <>
              <Card
                key={index + trnx.id.slice(0, 3)}
                sx={{
                  mb: "8px",
                  width: "95%",
                  height: "max-content",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "background.default",
                  borderRadius: "8px",
                  paddingX: "15px",
                  paddingY: "10px",
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
                    <DoneAllIcon sx={{ fontSize: "18px" }} />
                  ) : (
                    <CloseIcon sx={{ fontSize: "18px" }} />
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
                        <DoneIcon sx={{ fontSize: "18px" }} />
                      )}
                    </Button>
                  )}
                </Box>
              </Card>
            </>
          );
        })}
      {/* {
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""].map((s, index) => (
          <Card
            key={index}
            sx={{
              width: "95%",
              display: "flex",
              justifyContent: "space-between",
              paddingX: "15px",
              paddingY: "10px",
              bgcolor: 'background.default',
              mb: '8px',
              borderRadius: '8px'
            }}
          >
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Box sx={{}}>
                <Avatar>
                  <Typography color="white">{`sadf`}</Typography>
                </Avatar>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ fontSize: "15px" }}>{`sdf`}</Typography>

                <Typography sx={{ fontSize: "12px" }}>{`df`}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{ fontSize: "15px", fontWeight: "600" }}
                color={"Pay" === "Pay" ? "lightgreen" : "#FF6961"}
              >
                Rs {30}
              </Typography>
            </Box>
          </Card>))
      } */}
    </>
  );
};

export default TransactionsHistory;
