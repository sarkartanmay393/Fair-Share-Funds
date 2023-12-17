import { useState } from "react";
import { Box, CircularProgress, Fab, SxProps, Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { WelcomeBox } from "../components/Home/WelcomeBox";
import { Room } from "../interfaces";
import { useSupabaseContext } from "../provider/supabase/provider";
import generateRandomName from "../utils/generateRandomName";
import { useStoreState } from "../store/typedHooks";
import AddIcon from '@mui/icons-material/Add';
import { Rooms } from "../components/Home/Rooms";

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    mt: 6,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingX: 4,
    gap: 8,
    overflow: "scroll",
  },
};

export default function Homepage() {
  const navigate = useNavigate();
  const { supabase } = useSupabaseContext();
  const { user } = useStoreState((state) => state);

  const [loading, setLoading] = useState(false);

  // Creates a new rooms in db and add the room id to current user
  const handleNewRoom = () => {
    const triggerNewRoomCreation = async () => {
      setLoading(true);
      try {
        const name = generateRandomName();
        const newroom = {
          users_id: [`${user!.id}`],
          name: `Room ${name} `,
          created_by: user!.id,
        } as Room;

        const { data, error } = await supabase!
          .from("rooms")
          .insert(newroom)
          .select()
          .single();
        if (error) {
          setLoading(false);
          alert(error.message);
          return;
        }

        let currentRoomsOfUser = user!.rooms_id;
        if (currentRoomsOfUser) {
          currentRoomsOfUser.push(data.id);
        } else {
          currentRoomsOfUser = [data.id];
        }

        const resp = await supabase!
          .from("users")
          .update({
            rooms_id: currentRoomsOfUser,
          })
          .eq("id", user!.id);
        if (resp.error) {
          setLoading(false);
          alert(resp.error.message);
          return;
        }

        navigate(`/room/${data.id}`);
      } catch (e) { }
      setLoading(false);
    };

    triggerNewRoomCreation();
  };

  return (
    <Box sx={{ ...styles.container }}>
      <WelcomeBox />
      <Rooms />
      <Fab
        onClick={handleNewRoom}
        sx={{ position: "absolute", bottom: 32, right: 32 }}
        color="secondary"
        aria-label="add"
      >
        {loading ? <CircularProgress /> : <AddIcon />}
      </Fab>
    </Box>
  );
}
