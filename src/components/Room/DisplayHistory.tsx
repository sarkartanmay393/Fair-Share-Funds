import React, { useState } from "react";
import { SxProps, Theme, styled } from "@mui/material/styles";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { BalanceSheet, TransactionType } from "../../interfaces";
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

const DisplayHistory = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Box
      sx={{
        border: "1px solid red",
        position: "fixed",
        flexDirection: "column",
        gap: "10px",
        top: 60,
        width: "100%",
        display: "flex",
        paddingX: "15px",
        paddingY: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        
        }}
      >
        <Typography>Room History</Typography>
        <Button
          onClick={() => {
            setShowHistory(showHistory ? false : true);
          }}
        >
          {!showHistory && <KeyboardArrowDownIcon />}
          {showHistory && <KeyboardArrowUpIcon />}
        </Button>
      </Box>

      {showHistory && balanceSheet.sheet.map((transaction: any, index: number) => (
        <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              paddingX: "15px",
              paddingY: "10px",
              border: "1px solid red",
              borderRadius: "8px",
            }}
          >
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Box sx={{}}>
                <Avatar>D</Avatar>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: "15px" }}>{transaction.username}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                {transaction.type == "Due" ? `-` : `+`} {transaction.amount}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

    </Box>
  );
};
export default DisplayHistory;
