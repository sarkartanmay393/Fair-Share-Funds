import { Box, List, ListItem } from "@mui/material";
import { User } from "../../interfaces/index.ts";

import { useSupabaseContext } from "../../provider/supabase/useSupabase.ts";
import { useCurrentRoomData } from "../../utils/useCurrentRoomData.ts";
import { Transaction } from "../../interfaces/index.ts";
import TransactionCard from "./TransactionCard.tsx";

const TransactionsHistory = ({
  roomUsers,
  roomId,
}: {
  roomUsers?: User[];
  roomId: string;
}) => {
  const { session } = useSupabaseContext();
  const { currentTransactions } = useCurrentRoomData(roomId);

  return (
    <Box
      width="100%"
      height="calc(100vh - 132px)"
      paddingX={1}
      border="px solid green"
    >
      <List
        dense
        sx={{
          // border: '1px solid red',
          overflowY: "scroll",
          height: "100%",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: "end",
        }}
      >
        {currentTransactions?.map((trnx: Transaction) => {
          const fromUser = roomUsers?.find((u) => u.id === trnx.from_user);
          const toUserSelf = session?.user.id === trnx.to_user;
          return (
            <ListItem key={trnx.id.slice(0, 3)} sx={{ width: "100%" }}>
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
