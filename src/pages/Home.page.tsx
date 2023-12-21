import { useState } from "react";
import { Box, CircularProgress, Fab, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSupabaseContext } from "../provider/supabase/useSupabase.ts";
import { Rooms } from "../components/Home/Rooms.tsx";

import { Add } from "@mui/icons-material";
import { Database } from "@/utils/supabase/types.js";
import RoomCreationDialog from "@/components/Home/RoomCreationDialog.tsx";
import { useCurrentUser } from "@/utils/useCurrentUser.ts";
import generateRandomName from "@/utils/generateRandomName.ts";

export default function Homepage() {
  const navigate = useNavigate();
  const { supabase, session } = useSupabaseContext();
  const { cUser } = useCurrentUser();
  const [showRoomCreationModal, setShowRoomCreationModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // Creates a new rooms in db and add the room id to current user
  const handleNewRoom = () => {
    if (!supabase) {
      return;
    }
    const triggerNewRoomCreation = async () => {
      setLoading(true);
      try {
        const newroom = {
          users_id: [`${session?.user.id}`],
          name: generateRandomName(),
          created_by: session?.user.id,
          master_sheet: JSON.parse(`{"${session?.user.id}":null}`),
        } as Database["public"]["Tables"]["rooms"]["Row"];

        // console.log(newroom);
        const { data, error } = await supabase
          .from("rooms")
          .insert(newroom)
          .select()
          .single();

        if (error) {
          setLoading(false);
          // alert(error.message + "e");
          return;
        }

        let currentRoomsOfUser = cUser?.rooms_id;
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
          .eq("id", session?.user.id);
        if (resp.error) {
          setLoading(false);
          // alert(resp.error.message + "f");
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
            {cUser?.name}
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
