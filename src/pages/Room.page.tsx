import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { Transaction, TransactionType } from "../interfaces";
import InputBar from "../components/Room/Input";
import { Database } from "../utils/supabase/types";
import { useStoreActions } from "../store/typedHooks";
import { useSupabaseContext } from "../provider/supabase/provider";
import DisplayInputs from "../components/Room/DisplayInputs";
import DisplayHistory from "../components/Room/DisplayHistory";

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // alignItems: 'center',
  },
};

export default function RoomPage() {
  const { id } = useParams();
  
  const { supabase, session } = useSupabaseContext();
  const [data, setData] = React.useState<Database["public"]['Tables']['rooms']['Row']>();

  const { setAppbarTitle } = useStoreActions((actions) => actions);
  const navigate = useNavigate();

  const fetch = async () => {
    // setIsLoading(true);
    try {
      const resp = await supabase?.from('rooms').select().eq('id', id).single();
      const room = resp?.data as Database["public"]['Tables']['rooms']['Row'];
      if (resp?.error || (!room.users_id.includes(session!.user.id))) {
        navigate('/');
        return;
      }
      if (room) {
        setAppbarTitle(room.name || 'FSF Room');
        setData(room);
      }
      // setIsLoading(false);
    } catch (e) { }
    // setIsLoading(false);
  }

  useEffect(() => {
    fetch();

    return () => {
      setAppbarTitle('Fair Share Funds');
    };
  }, [])

  const transactionProps: Transaction = {
    id: "1",
    from: "user1@example.com",
    to: "user2@example.com",
    time: new Date(),
    amount: 100,
    type: TransactionType.Pay,
    room_id: "room123",
    sheet_id: "sheet456",
  };

  

  return (
    <Box sx={{ ...styles.container }}>
      <DisplayHistory />
      <DisplayInputs {...transactionProps} />
      <InputBar
        styles={{ border: "1px solid red", position: "fixed", bottom: 0 }}
      />
    </Box>
  );
}
