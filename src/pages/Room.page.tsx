import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  BalanceSheet,
  Room,
  Transaction,
  TransactionType,
} from "../interfaces";
import InputBar from "../components/Room/Input";
import { Database } from "../utils/supabase/types";
import { useStoreActions, useStoreState } from "../store/typedHooks";
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
  const [data, setData] = React.useState<Room>();
  const [isLoading, setIsLoading] = React.useState(true);

  const { supabase } = useSupabaseContext();
  const { user, rooms } = useStoreState((state) => state);
  const { setAppbarTitle } = useStoreActions((actions) => actions);
  const navigate = useNavigate();

  useEffect(() => {
    const room = rooms?.find((room) => room.id === id);
    if (room) {
      setAppbarTitle(room.name!);
      setData(room);
    } else {
      navigate("/");
      return;
    }
  }, []);

  // const fetch = async () => {
  //   setIsLoading(true);
  //   try {
  //     const { data, error } = await supabase.from('rooms').select().eq('id', id);
  //     const dt = data && data[0] as Database["public"]['Tables']['rooms']['Row'];
  //     if (error?.code !== '201' || (dt && !dt.users_id.includes(user.id))) {
  //       navigate('/');
  //       return;
  //     }
  //     if (dt) { setData({ ...dt, master_sheet: JSON.stringify(dt.master_sheet) }) }
  //     setIsLoading(false);
  //   } catch (e) { }
  //   setIsLoading(false);
  // }

  // useEffect(() => {
  //   fetch();
  // }, [])

  //dummy datas

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
