import { Box, List, ListItem, Typography } from "@mui/material";

import { Transaction, UserData } from "../../interfaces/index.ts";
import TransactionCard from "./TransactionCard.tsx";
import { useEffect, useRef, useState } from "react";
import { useStoreState } from "@/store/typedHooks.ts";
import supabase from "@/utils/supabase/supabase.ts";

interface Props {
  roomUsers: UserData[];
  // messages: Message[];
  // transactionIds: string[];
}

const TransactionsHistory = ({ roomUsers }: Props) => {
  const lastTransactionsBoxRef = useRef<HTMLLIElement>(null);
  const pathname = window.location.pathname;
  const roomId = pathname.split("/")[2];
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { user } = useStoreState((state) => state);
  // const [data, setData] = useState<(Message | Transaction)[]>([]);

  // useEffect(() => {
  //   const container = trnxBoxy.current;
  //   if (!container) return;

  //   window.scrollTo({ top: container.scrollHeight });
  // ({ top: trnxBoxy.current?.scrollTop });
  //   console.log(window.scrollX);
  // }, []);

  // useEffect(() => {
  //   const list = [...messages, ...transactions] as (Message | Transaction)[];
  //   list.sort((a, b) => {
  //     const da = new Date(a.created_at).getTime();
  //     const db = new Date(b.created_at).getTime();
  //     return da - db;
  //   });

  //   setData(list);
  // }, []);

  useEffect(() => {
    if (window && document) {
      const lastContainer = lastTransactionsBoxRef.current;
      if (lastContainer) {
        lastContainer.scrollIntoView();
      }
    }
  }, [transactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      console.log("Fetching Transactions...");
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .eq("room_id", roomId)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }
        console.log("Fetched Transactions...");
        setTransactions(data as Transaction[]);
        setLoading(false);
      } catch (e) {
        console.log("Failed fetching transactions...", e);
        console.log(e);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel(`${roomId}`)
      .on("broadcast", { event: "incoming-transaction" }, ({ payload }) => {
        console.log(" received!", payload);
        setTransactions((p) => [...p, payload]);
      })
      .on("broadcast", { event: "approving-transaction" }, ({ payload }) => {
        console.log(" received!", payload);
        setTransactions((p) =>
          p.map((t) => ({
            ...t,
            approved: payload.id == t.id ? true : t.approved,
          }))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box
      flexGrow={1}
      paddingX={1}
      border="px solid green"
      paddingTop={6}
      sx={{ overflowY: "scroll" }}
    >
      {loading ? (
        <Box
          height="100%"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <pre>Please wait a while...</pre>
        </Box>
      ) : (
        <List
          dense
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {transactions.length > 0 ? (
            transactions.map((transaction, i) => {
              // if ("to_user" in transaction) {
              const fromUser = roomUsers.find(
                (u) => u.id === transaction.from_user
              );
              const toUserSelf = user?.id === transaction.to_user;
              return (
                <ListItem
                  key={transaction.id.slice(0, 3)}
                  ref={
                    transactions.length === i + 1
                      ? lastTransactionsBoxRef
                      : null
                  }
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
