import { Avatar, Box, Card, List, ListItem, Typography } from "@mui/material";

import { Message, Transaction, UserData } from "../../interfaces/index.ts";
import TransactionCard from "./TransactionCard.tsx";
import { useEffect, useRef, useState } from "react";
import { useStoreState } from "@/store/typedHooks.ts";

interface Props {
  roomUsers: UserData[];
  transactions: Transaction[];
  messages: Message[];
}

const TransactionsHistory = ({ roomUsers, transactions, messages }: Props) => {
  const transactionsBoxRef = useRef<HTMLElement>();
  // const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { user } = useStoreState((state) => state);
  const [data, setData] = useState<(Message | Transaction)[]>([]);

  // useEffect(() => {
  //   const container = trnxBoxy.current;
  //   if (!container) return;

  //   window.scrollTo({ top: container.scrollHeight });
  // ({ top: trnxBoxy.current?.scrollTop });
  //   console.log(window.scrollX);
  // }, []);

  useEffect(() => {
    const list = [...messages, ...transactions] as (Message | Transaction)[];
    list.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return da - db;
    });

    setData(list);
  }, []);

  return (
    <Box
      ref={transactionsBoxRef}
      width="100%"
      height="calc(100vh - 220px)"
      paddingX={1}
      border="px solid green"
      margin="auto"
      // paddingBottom={2}
      // overflow="clip"
    >
      <List
        dense
        sx={{
          // border: '1px solid red',
          display: "flex",
          // flexDirection: "column",
          // justifyContent: "end",
          height: "100%",
          // pt: "62px",
          // pb: { xs: "68px", md: "74px" },
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        {data.length > 0 ? (
          data.map((transaction) => {
            if ("to_user" in transaction) {
              const fromUser = roomUsers.find(
                (u) => u.id === transaction.from_user
              );
              const toUserSelf = user?.id === transaction.to_user;
              return (
                <ListItem
                  key={transaction.id.slice(0, 3)}
                  sx={{
                    width: "100%",
                    border: "px solid red",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TransactionCard
                    fromUserData={fromUser}
                    toUserDataSelf={toUserSelf}
                    transaction={transaction}
                  />
                </ListItem>
              );
            } else {
              const fromUser = roomUsers.find(
                (u) => u.id === transaction.from_user
              );

              return (
                <ListItem
                  key={transaction.id.slice(0, 3)}
                  sx={{
                    width: "100%",
                    border: "px solid red",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
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
                    <Box
                      sx={{ display: "flex", gap: "18px" }}
                      border="px solid red"
                    >
                      <Avatar>
                        {(fromUser?.name ?? "Noname").trim().charAt(0)}
                      </Avatar>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography sx={{ fontSize: "12px" }}>
                          {transaction.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </ListItem>
              );
            }
          })
        ) : (
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "GrayText" }}>
              {" "}
              No transactions done yet 🙅🏽‍♂️
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default TransactionsHistory;
