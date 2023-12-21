import { Box, List, ListItem } from "@mui/material";
import { User } from "../../interfaces/index.ts";

import { useSupabaseContext } from "../../provider/supabase/useSupabase.ts";
import { useCurrentRoomData } from "../../utils/useCurrentRoomData.ts";
import { Transaction } from "../../interfaces/index.ts";
import TransactionCard from "./TransactionCard.tsx";
import { useRef } from "react";

const TransactionsHistory = ({
  roomUsers,
  roomId,
}: {
  roomUsers?: User[];
  roomId: string;
}) => {
  const { session } = useSupabaseContext();
  const { currentTransactions } = useCurrentRoomData();
  const trnxBoxy = useRef<HTMLElement>();
  if (roomId) {
    null;
  }

  // useEffect(() => {
  //   const container = trnxBoxy.current;
  //   if (!container) return;

  //   window.scrollTo({ top: container.scrollHeight });
  //   // ({ top: trnxBoxy.current?.scrollTop });
  //   console.log(window.scrollX);
  // }, []);

  return (
    <Box
      ref={trnxBoxy}
      width="100%"
      height="calc(100vh - 64px)"
      paddingX={1}
      border="px solid green"
      // overflow="clip"
    >
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
        {currentTransactions?.map((trnx: Transaction) => {
          const fromUser = roomUsers?.find((u) => u.id === trnx.from_user);
          const toUserSelf = session?.user.id === trnx.to_user;
          return (
            <ListItem
              key={trnx.id.slice(0, 3)}
              sx={{
                width: "100%",
                border: "px solid red",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TransactionCard
                fromUser={fromUser}
                toUserSelf={toUserSelf}
                trnx={trnx}
                roomUsers={roomUsers}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default TransactionsHistory;
