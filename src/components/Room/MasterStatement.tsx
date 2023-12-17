import { useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, Card, Typography } from "@mui/material";
import { TransactionType } from "../../interfaces";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Dummy BalanceSheet data
const balanceSheet = {
  id: "balance123",
  room_id: "room123",
  users_count: 2,
  sheet: [
    {
      username: "usr1",
      type: TransactionType.Due,
      amount: 100,
    },
    {
      username: "usr2",
      type: TransactionType.Pay,
      amount: 400,
    },
  ],
};

const MasterStatement = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Card
      raised
      sx={{
        position: 'fixed',
        top: { xs: '64px', sm: '70px' },
        zIndex: 3,
        border: "px solid red",
        borderRadius: 3,
        flexDirection: "column",
        width: "96%",
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<KeyboardArrowDownIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Statement</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {balanceSheet.sheet.map((transaction: any, index: number) => (
            <Box
              key={index}
              sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  paddingX: "15px",
                  paddingY: "10px",
                  border: "px solid red",
                  borderRadius: "8px",
                }}
              >
                <Box sx={{ display: "flex", gap: "20px" }}>
                  <Box sx={{}}>
                    <Avatar>D</Avatar>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "15px" }}>
                      {transaction.username}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                    {transaction.type === "Due" ? `-` : `+`} {transaction.amount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
export default MasterStatement;
