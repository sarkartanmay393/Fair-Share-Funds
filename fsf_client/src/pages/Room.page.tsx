import React, { useEffect } from "react";
import { Box, CircularProgress, Input, Typography } from "@mui/material";

import { WhiteBoard } from "../components/WhiteBoard";
import CustomizedSelects from "../components/Room/Input";
import InputBar from "../components/Room/Input";
import { useSupabaseContext } from "../provider/supabase/provider";
import { useNavigate, useParams } from "react-router-dom";
import { Room } from "../interfaces";
import { Database } from "../utils/supabase/types";

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: '64px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    width: '100%',
    height: 'calc(100% - 64px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
}

export default function RoomPage() {
  const { slug } = useParams();
  const [data, setData] = React.useState<Room>();
  const [isLoading, setIsLoading] = React.useState(true);
  const { user, supabase } = useSupabaseContext();
  const navigate = useNavigate();


  const fetch = async () => {
    if (user && supabase) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('rooms').select().eq('slug', slug);
        const dt = data && data[0] as Database["public"]['Tables']['rooms']['Row'];
        if (error?.code !== '201' || (dt && !dt.users_id.includes(user.id))) {
          navigate('/');
          return;
        }
        if (dt) { setData({ ...dt, master_sheet: JSON.stringify(dt.master_sheet) }) }
        setIsLoading(false);
      } catch (e) { }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [])


  return (
    <>
      {isLoading ? <CircularProgress /> :
        (data && (<Box sx={{ ...styles.container }}>
          <Box sx={{ ...styles.header }}>
            <Typography fontSize={24} fontWeight={600}>
              {data.name}
            </Typography>
          </Box>
          <Box sx={{ ...styles.body, border: 'px solid red' }}>
            <InputBar styles={{ border: '1px solid red', position: 'fixed', bottom: 0 }} />
          </Box>
        </Box>))}
    </>
  );
}