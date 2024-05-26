import { useState } from "react";

import { Box, CircularProgress, Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import { Rooms } from "@/components/Home/Rooms.tsx";
import supabase from "@/utils/supabase/supabase.ts";
import generateRandomName from "@/utils/generateRandomName.ts";
import { useStoreState } from "@/store/typedHooks.ts";

export default function Homepage() {
  const { user, userData } = useStoreState((state) => state);

  const [loading, setLoading] = useState(false);
  // const [showRoomCreationModal, setShowRoomCreationModal] = useState(false);

  // Creates a new rooms in db and add the room id to current user
  const handleNewRoom = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("Not authenticated user found!");
      }

      const newroom = {
        users_id: [user.id],
        name: generateRandomName(),
        created_by: user.id,
        transactions_id: [],
      };

      // console.log(newroom);
      const { data, error } = await supabase
        .from("rooms")
        .insert(newroom)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("sending broadcast new room to self");
      const status = await supabase.channel(`${user.id} selfch`).send({
        type: "broadcast",
        event: "new-room-creation",
        payload: { ...data },
      });
      console.log("new-room-creation", status);

      let roomsOfCurrentUser = userData?.rooms_id;
      if (roomsOfCurrentUser) {
        roomsOfCurrentUser.push(data.id);
      } else {
        roomsOfCurrentUser = [data.id];
      }

      const { error: errorUserUpdate } = await supabase
        .from("users")
        .update({
          rooms_id: roomsOfCurrentUser,
        })
        .eq("id", user.id);

      if (errorUserUpdate) {
        throw errorUserUpdate;
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingX: { xs: 2, sm: 4 },
        gap: 4,
        py: 2,
      }}
    >
      <Box
        width="100%"
        height="72px"
        display="flex"
        bgcolor="#89a1dd"
        borderRadius="100px 8px 80px 8px"
        alignItems="center"
        justifyContent="center"
      >
        <Typography fontWeight={500} fontSize={{ xs: 26, sm: 32 }}>
          Hi,{" "}
          <Typography
            component="span"
            fontWeight={600}
            fontSize={{ xs: 26, sm: 32 }}
          >
            {userData?.name}
          </Typography>
        </Typography>
      </Box>
      <Rooms />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          fontWeight={600}
          fontSize={{ xs: 10, sm: 12 }}
          color="lightgray"
        >
          Made with 🤍 in India
        </Typography>
        <Typography fontSize={{ xs: 8, sm: 10 }} color="lightgray">
          Copyright @2024
        </Typography>
      </Box>
      <Fab
        onClick={handleNewRoom}
        sx={{ position: "absolute", bottom: 32, right: 32 }}
        color="secondary"
        aria-label="add"
        size="medium"
      >
        {loading ? <CircularProgress /> : <Add />}
      </Fab>
    </Box>
  );
}
