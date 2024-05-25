import { useState } from "react";

import { Box, CircularProgress, Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import { Rooms } from "@/components/Home/Rooms.tsx";
import RoomCreationDialog from "@/components/Home/RoomCreationDialog.tsx";
import supabase from "@/utils/supabase/supabase.ts";
import generateRandomName from "@/utils/generateRandomName.ts";
import { useStoreState } from "@/store/typedHooks.ts";

export default function Homepage() {
  const { user, userData } = useStoreState((state) => state);

  const [loading, setLoading] = useState(false);
  const [showRoomCreationModal, setShowRoomCreationModal] = useState(false);

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
      await supabase.channel(`${user.id} selfch`).send({
        type: "broadcast",
        event: "new-room-creation",
        payload: { ...data },
      });

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
        minHeight="72px"
        // mt={6}
        px={2}
        display="flex"
        bgcolor="#89a1dd"
        borderRadius="100px 8px 80px 8px"
        alignItems="center"
        justifyContent="center"
      >
        {/* <img src={LandingAvatar} alt="fsf landing page avatar" />  */}
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
      <Fab
        onClick={handleNewRoom}
        // onClick={() => setShowRoomCreationModal(true)}
        sx={{ position: "absolute", bottom: 32, right: 32 }}
        color="secondary"
        aria-label="add"
      >
        {loading ? <CircularProgress /> : <Add />}
      </Fab>
      <RoomCreationDialog
        handleNewRoom={handleNewRoom}
        show={showRoomCreationModal}
        setShow={setShowRoomCreationModal}
      />
    </Box>
  );
}
