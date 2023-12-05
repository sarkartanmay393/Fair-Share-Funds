import React, { useState } from "react";
import { Button, CircularProgress, Grid, SxProps, Theme, Typography } from "@mui/material";
import { useSupabaseContext } from "../provider/supabase/provider";
import { PlusOneRounded } from "@mui/icons-material";
import { Database } from "../utils/supabase/types";
import { useNavigate } from "react-router-dom";

interface IWelcomeBox {
  isLoading: boolean;
  handleOpenBoard?: React.MouseEventHandler<HTMLButtonElement>;
}

const styles: { [key: string]: SxProps<Theme> } = {
  roomcard: {
    width: '84px',
    height: '84px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const randomRoomName = () => {
  const names = ['Darknight', 'Lucy', 'Roronoa', 'Gojo', 'Gogo'];
  return names[(Math.abs(Math.random() - 0.5) * 10) % names.length];
}

export const WelcomeBox = ({ isLoading }: IWelcomeBox) => {
  const { user, supabase } = useSupabaseContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNewRoom = () => {
    const triggerNewRoomCreation = async () => {
      if (user && supabase) {
        setLoading(true);
        try {
          const name = randomRoomName();
          const newroom = {
            slug: 'dev-' + name,
            users_id: [`${user && user.id}`],
            name: `Room ${name} `,
            created_by: user && user.id,
          } as Database["public"]['Tables']['rooms']['Row'];
          const { data, error } = await supabase.from('rooms').insert(newroom).select();
          if (error && error.code !== '201') {
            setLoading(false);
            return;
          }
          navigate(`/rooms/${newroom.slug}`)
        } catch (e) { }
        setLoading(false);
      }
    };
    triggerNewRoomCreation();
  }

  return (
    <React.Fragment>
      <Typography fontSize={{ xs: 26, sm: 32 }}>
        Hi, {user?.email?.split('@')[0]}
      </Typography>
      <Grid>
        <Button onClick={handleNewRoom} variant="contained" sx={styles.roomcard}>
          {loading
            ? <CircularProgress sx={{ color: "black" }} /> :
            <PlusOneRounded sx={{ borderRadius: '100%', fontSize: 36 }} />}
        </Button>
        { }
      </Grid>
    </React.Fragment>
  );
}