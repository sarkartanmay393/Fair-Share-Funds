import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { Room } from "../interfaces";
import InputBar from "../components/Room/Input";
import RoomUserManager from "./UserManager.page";
import { Database } from "../utils/supabase/types";
import { useSupabaseContext } from "../provider/supabase/provider";
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
  const pathname = window.location.pathname;
  
  const { supabase, session } = useSupabaseContext();
  const [data, setData] = React.useState<Database["public"]['Tables']['rooms']['Row']>();

  const { setAppbarTitle } = useStoreActions((actions) => actions);
  const navigate = useNavigate();


  // useEffect(() => {
  //   const room = rooms?.find((room) => (room.id === id));
  //   if (room) {
  //     setAppbarTitle(room.name!);
  //     setData(room);
  //   } else {
  //     navigate('/');
  //     return;
  //   }
  // }, [])

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
