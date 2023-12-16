import React, { useEffect, useState } from "react";
import { Avatar, AvatarGroup, Box, Card, CircularProgress, Fab, Grid, SxProps, Theme, Typography } from "@mui/material";
import { useSupabaseContext } from "../provider/supabase/provider";
import { Link, useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "../store/typedHooks";

import AddIcon from '@mui/icons-material/Add';
import LandingAvatar from '../assets/landing-avatar.svg';
import { Room } from "../interfaces";

interface IWelcomeBox {
  isLoading: boolean;
  handleOpenBoard?: React.MouseEventHandler<HTMLButtonElement>;
}

const styles: { [key: string]: SxProps<Theme> } = {
  roomcard: {
    width: '160px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'primary.main',
    borderRadius: '8px',
    overflow: 'hidden',
    gap: 1,
    cursor: 'pointer',
    ':hover': {
      'backgroundColor': 'primary.dark'
    }
  },
}

const randomRoomName = () => {
  const names = ['Darknight', 'Lucy', 'Roronoa', 'Gojo', 'Gogo'];
  return names[Math.round(Math.abs(Math.random() - 0.5) * 10) % names.length];
}

export const WelcomeBox = () => {
  const { session, supabase } = useSupabaseContext();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { user, rooms } = useStoreState((state) => state);
  const { setRooms } = useStoreActions((act) => act);
  const navigate = useNavigate();

  const users = ["", '', '', '', '', '', ''];


  // Creates a new rooms in db and add the room id to current user
  const handleNewRoom = () => {
    const triggerNewRoomCreation = async () => {
      setIsLoading(true);
      try {
        const name = randomRoomName();
        const newroom = {
          slug: 'dev-' + name,
          users_id: [`${user!.id}`],
          name: `Room ${name} `,
          created_by: user!.id,
        } as Room;

        const { data, error } = await supabase!.from('rooms').insert(newroom).select().single();
        if (error) {
          setIsLoading(false);
          console.log(error?.message);
          return;
        }

        let currentRoomsOfUser = user!.rooms_id;
        if (currentRoomsOfUser) {
          currentRoomsOfUser.push(data.id)
        } else {
          currentRoomsOfUser = [data.id];
        }

        const resp = await supabase!.from('users').update({
          rooms_id: currentRoomsOfUser,
        }).eq('id', user!.id);
        if (resp.status !== 204) {
          setIsLoading(false);
          console.log(resp.error?.message);
          return;
        } else {
          navigate(`/room/${data.id}`);
        }
      } catch (e) { }
      setIsLoading(false);
    };

    triggerNewRoomCreation();
  }

  useEffect(() => {
    // loads the rooms information to the app
    const loadRooms = () => {
      setLoading(true);
      const fetchRooms = async () => {
        try {
          const { data, error } = await supabase!.from('rooms').select('*').in('id', user!.rooms_id || []);
          if (error) {
            console.log(error)
            setLoading(false);
            return;
          }
          if (data.length > 0) {
            // console.log(data)
            setRooms(data as Room[]);
          }
          setLoading(false);
        } catch (err) { setLoading(false); }
      }
      fetchRooms();
    }

    loadRooms();
  }, []);

  return (
    <>
      <Box width='100%' mt={6} px={2} display='flex' bgcolor='#89a7d9' borderRadius='100px 8px 80px 8px' alignItems='center'>
        <img src={LandingAvatar} alt='fsf landing page avatar' />
        <Typography fontWeight={600} fontSize={{ xs: 26, sm: 32 }}>
          Hi, {user?.email?.split('@')[0]}
        </Typography>
      </Box>
      <Grid container spacing={1} justifyContent='center'>
        {loading ? <CircularProgress /> :
          <>
            {rooms && rooms.map((room, index) => (
              <Grid key={index} item>
                <Link to={{ pathname: `/room/${room.id}` }}>
                  <Card sx={styles.roomcard}>
                    {/* <PlusOneRounded sx={{ borderRadius: '100%', fontSize: 36 }} /> */}
                    <AvatarGroup componentsProps={{
                      additionalAvatar: { sx: { width: '24px', height: '24px' } }
                    }}>
                      {users.map((user) => (
                        <Avatar sx={{ width: '24px', height: '24px' }} />
                      ))}
                    </AvatarGroup>
                    <Typography color='black' fontSize={{ xs: '20px', md: '22px' }}>
                      {room.name}
                    </Typography>
                  </Card>
                </Link>
              </Grid>
            ))}
            {!rooms && <Typography>No room data</Typography>}
          </>
        }
      </Grid>
      <Fab onClick={handleNewRoom} sx={{ position: 'absolute', bottom: 32, right: 32 }} color="secondary" aria-label="add">
        {isLoading ? <CircularProgress /> : <AddIcon />}
      </Fab>
    </>
  );
}