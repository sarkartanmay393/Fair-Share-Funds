import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import { Room } from "../interfaces";
import InputBar from "../components/Room/Input";
import { Database } from "../utils/supabase/types";
import { useStoreActions, useStoreState } from "../store/typedHooks";
import { useSupabaseContext } from "../provider/supabase/provider";

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
  }
}

export default function RoomPage() {
  const { id } = useParams();
  const [data, setData] = React.useState<Room>();
  const [isLoading, setIsLoading] = React.useState(true);

  const { supabase } = useSupabaseContext();
  const { user, rooms } = useStoreState((state) => state);
  const { setAppbarTitle } = useStoreActions((actions) => actions);
  const navigate = useNavigate();


  useEffect(() => {
    const room = rooms?.find((room) => (room.id === id));
    if (room) {
      setAppbarTitle(room.name!);
      setData(room);
    } else {
      navigate('/');
      return;
    }
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


  return (
    <Box sx={{ ...styles.container }}>
      <InputBar styles={{ border: '1px solid red', position: 'fixed', bottom: 0 }} />
    </Box >
  );
}