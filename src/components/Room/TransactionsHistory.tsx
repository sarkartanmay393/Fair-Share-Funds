import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import { Room, Transaction, UserData } from "../../interfaces/index.ts";
import TransactionCard from "./TransactionCard.tsx";
import { useEffect, useRef, useState } from "react";
import { useStoreState } from "@/store/typedHooks.ts";
import supabase from "@/utils/supabase/supabase.ts";

interface Props {
  roomUsers: UserData[];
  roomData: Room;
  roomId: string;
}

const TransactionsHistory = ({ roomUsers, roomData }: Props) => {
  const trnxBoxy = useRef<HTMLElement>();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { user } = useStoreState((state) => state);

  // useEffect(() => {
  //   const container = trnxBoxy.current;
  //   if (!container) return;

  //   window.scrollTo({ top: container.scrollHeight });
  //   // ({ top: trnxBoxy.current?.scrollTop });
  //   console.log(window.scrollX);
  // }, []);

  useEffect(() => {
    const fetchCurrentTransactions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .in("id", roomData.transactions_id ?? []);

        if (error) {
          throw error;
        }
        setTransactions(data as Transaction[]);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchCurrentTransactions();
  }, [roomData.transactions_id]);

  useEffect(() => {
    const transactionChannel = supabase
      .channel(`transaction ch ${roomData.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "transactions" },
        (payload) => {
          console.log(`UPDATE transaction`, payload);
          const updatedTransaction = payload.new as Transaction;
          const updatedTransactions = transactions
            .filter((t) => t.id !== updatedTransaction.id)
            .concat(updatedTransaction);
          setTransactions(updatedTransactions);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        (payload) => {
          console.log(`INSERT transaction`, payload);
          setTransactions((p) => p.concat(payload.new as Transaction));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionChannel);
    };
  }, []);

  return (
    <Box
      ref={trnxBoxy}
      width="100%"
      height="calc(100vh - 64px)"
      paddingX={1}
      border="px solid green"
      // overflow="clip"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <List
          dense
          sx={{
            // border: '1px solid red',
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: "end",
            height: "100%",
            pt: "62px",
            pb: { xs: "68px", md: "74px" },
            overflowY: "scroll",
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
                    roomId={roomData.id}
                    masterSheet={roomData.master_sheet}
                    fromUserData={fromUser}
                    toUserDataSelf={toUserSelf}
                    transaction={transaction}
                    roomUsers={roomUsers}
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
