import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import { Transaction, UserData } from "../../interfaces/index.ts";
import TransactionCard from "./TransactionCard.tsx";
import { useRef, useState } from "react";
import { useStoreState } from "@/store/typedHooks.ts";

interface Props {
  roomUsers: UserData[];
  transactions: Transaction[];
}

const TransactionsHistory = ({ roomUsers, transactions }: Props) => {
  const trnxBoxy = useRef<HTMLElement>();
  const [loading] = useState(false);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { user } = useStoreState((state) => state);

  // useEffect(() => {
  //   const container = trnxBoxy.current;
  //   if (!container) return;

  //   window.scrollTo({ top: container.scrollHeight });
  // ({ top: trnxBoxy.current?.scrollTop });
  //   console.log(window.scrollX);
  // }, []);



  return (
    <Box
      ref={trnxBoxy}
      width="100%"
      height="calc(100vh - 220px)"
      paddingX={1}
      border="px solid green"
      margin="auto"
      // paddingBottom={2}
      // overflow="clip"
    >
      {loading ? (
        <CircularProgress />
      ) : (
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
          {transactions.length > 0 ? (
            transactions.map((transaction: Transaction) => {
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
      )}
    </Box>
  );
};

export default TransactionsHistory;
