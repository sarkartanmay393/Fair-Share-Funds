import { useState } from "react";
import { Box, CircularProgress, Fab, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSupabaseContext } from "../provider/supabase/useSupabase.ts";
import generateRandomName from "../utils/generateRandomName.ts";
import { useStoreState } from "../store/typedHooks.ts";
import { Rooms } from "../components/Home/Rooms.tsx";

import { Add } from "@mui/icons-material";
import LandingAvatar from "../assets/landing-avatar.svg";
import { Database } from "@/utils/supabase/types.js";

export default function Homepage() {
  const navigate = useNavigate();
  const { supabase, session } = useSupabaseContext();
  const { user } = useStoreState((state) => state);

  const [loading, setLoading] = useState(false);

  // Creates a new rooms in db and add the room id to current user
  const handleNewRoom = () => {
    if (!supabase) {
      return;
    }
    const triggerNewRoomCreation = async () => {
      setLoading(true);
      try {
        const name = generateRandomName();

        const newroom = {
          users_id: [`${user?.id}`],
          name: `Room ${name} `,
          created_by: user?.id,
          master_sheet: JSON.parse(`{"${session?.user.id}":null}`),
        } as Database["public"]["Tables"]["rooms"]["Row"];

        const { data, error } = await supabase
          .from("rooms")
          .insert(newroom)
          .select()
          .single();

        if (error) {
          setLoading(false);
          alert(error.message);
          return;
        }

        let currentRoomsOfUser = user?.rooms_id;
        if (currentRoomsOfUser) {
          currentRoomsOfUser.push(data.id);
        } else {
          currentRoomsOfUser = [data.id];
        }

        const resp = await supabase
          .from("users")
          .update({
            rooms_id: currentRoomsOfUser,
          })
          .eq("id", user?.id);
        if (resp.error) {
          setLoading(false);
          alert(resp.error.message);
          return;
        }

        navigate(`/room/${data.id}`);
      } catch (e) {
        null;
      }
      setLoading(false);
    };

    triggerNewRoomCreation();
  };

  return (
    <Box
      sx={{
        mt: 6,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        paddingX: 4,
        gap: 8,
      }}
    >
      <Box
        width="100%"
        // mt={6}
        px={2}
        display="flex"
        bgcolor="#89a7d9"
        borderRadius="100px 8px 80px 8px"
        // alignItems="center"
      >
        <img src={LandingAvatar} alt="fsf landing page avatar" />
        <Typography fontWeight={600} fontSize={{ xs: 26, sm: 32 }}>
          Hi, {user?.username}
        </Typography>
      </Box>
      <Rooms />
      <Fab
        onClick={handleNewRoom}
        sx={{ position: "absolute", bottom: 32, right: 32 }}
        color="secondary"
        aria-label="add"
      >
        {loading ? <CircularProgress /> : <Add />}
      </Fab>
    </Box>
  );
}
