import { Avatar, Box, Card, Grid, Typography } from "@mui/material";
import { Transaction, User } from "../../interfaces";

const TransactionsHistory = ({
  transactions,
  roomUsers,
}: {
  transactions?: Transaction[];
  roomUsers?: User[];
}) => {
  return (
    <>
      {
        transactions &&
        transactions.map((trnx, index) => {
          const fromUser = roomUsers?.find((u) => u.id === trnx.from_user);
          return (
            <>
              <Card
                key={index + trnx.id.slice(0, 3)}
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
                      <Typography color="white">
                        {`${fromUser?.name
                          .split(" ")
                          .at(0)
                          ?.at(0)}${fromUser?.name.split(" ").at(1)?.at(0)}`}
                      </Typography>
                    </Avatar>
                  </Box>
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
                      {roomUsers?.find((u) => u.id === trnx.to_user)?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    sx={{ fontSize: "15px", fontWeight: "600" }}
                    color={trnx.type === "Pay" ? "lightgreen" : "#FF6961"}
                  >
                    Rs {trnx.amount}
                  </Typography>
                </Box>
              </Card>
            </>
          );
        })
      }
      {
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
      }
    </>
  );
};

export default TransactionsHistory;
