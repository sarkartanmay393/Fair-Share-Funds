import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Input,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { User } from "../interfaces/index.ts";
import { useStoreActions } from "../store/typedHooks.ts";
import { useSupabaseContext } from "../provider/supabase/useSupabase.ts";
import { useEffect } from "react";
import { useCurrentRoomData } from "../utils/useCurrentRoomData.ts";
import { RemoveCircleOutline, PersonAdd } from "@mui/icons-material";

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 2,
    alignItems: "center",
    bgcolor: "background.paper",
  },
};

export default function RoomUserManager() {
  const pathname = window.location.pathname;
  const roomId = pathname.split("/")[2];

  const { supabase } = useSupabaseContext();
  const { setAppbarTitle } = useStoreActions((actions) => actions);

  const [willBeDeleted, setWillBeDeleted] = useState("");
  const [searchInfo, setSearchInfo] = useState("");
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [roomUsers, setRoomUsers] = useState<User[] | undefined>();
  const [, setDeleteButtonLoading] = useState(false);

  const { currentRoomData } = useCurrentRoomData(roomId);

  useEffect(() => {
    setAppbarTitle(currentRoomData?.name || "FSF Room Manager");
    const getUserDetails = async () => {
      const resp = await supabase
        ?.from("users")
        .select(`*`)
        .in("id", currentRoomData?.users_id || []);

      if (resp && resp.error) {
        return;
      }
      setRoomUsers(resp && resp.data);
    };

    getUserDetails();

    return () => {
      setAppbarTitle("Fair Share Funds");
    };
  }, [currentRoomData]);

  const handleAddNewUser = () => {
    setAddButtonLoading(true);
    const isEmail = searchInfo.includes("@");
    const handleSupabaseOperations = async () => {
      const resp = await supabase
        ?.from("users")
        .select(`id, rooms_id`)
        .eq(isEmail ? "email" : "username", searchInfo)
        .single();

      if (!resp || resp?.error) {
        alert(resp?.error.message);
        setAddButtonLoading(false);
        return;
      }

      if (currentRoomData?.users_id.indexOf(resp?.data.id) !== -1) {
        alert(`User already in the room!`);
        setAddButtonLoading(false);
        return;
      }

      supabase
        ?.from("users")
        .update({ rooms_id: [...resp.data.rooms_id, roomId] })
        .eq("id", resp?.data.id)
        .then(({ error }) => {
          if (error) {
            alert(error.message);
            setAddButtonLoading(false);
            return;
          }
        });

      supabase
        ?.from("rooms")
        .update({ users_id: [...currentRoomData.users_id, resp?.data.id] })
        .eq(`id`, roomId)
        .then(({ error }) => {
          if (error) {
            alert(error.message);
            setAddButtonLoading(false);
            return;
          }
        });

      setAddButtonLoading(false);
      setSearchInfo("");
    };

    handleSupabaseOperations();
  };

  const handleRemoveUser = (user: User) => {
    setWillBeDeleted(user.id);
    setDeleteButtonLoading(true);
    const handleSupabaseOperations = async () => {
      const updateRoomsId = user.rooms_id?.filter((id) => id !== roomId);
      const resp = await supabase
        ?.from("users")
        .update({ rooms_id: updateRoomsId })
        .eq("id", user.id);
      if (resp && resp.error) {
        alert(resp.error);
        setWillBeDeleted("");
        setDeleteButtonLoading(false);
        return;
      }

      const updateUsersId = currentRoomData?.users_id.filter(
        (id) => id !== user.id
      );
      const resp2 = await supabase
        ?.from("rooms")
        .update({ users_id: updateUsersId })
        .eq("id", roomId);
      if (resp2 && resp2.error) {
        alert(resp2.error);
        setWillBeDeleted("");
        setDeleteButtonLoading(false);
        return;
      }

      setWillBeDeleted("");
      setDeleteButtonLoading(false);
    };

    handleSupabaseOperations();
  };

  return (
    <Box sx={{ ...styles.container }}>
      <Grid container mb={2} width="100%" justifyContent="center">
        <Typography variant="h6" component="h2" fontWeight={600}>
          Manager Room Users
        </Typography>
      </Grid>
      <Box
        component="form"
        display="flex"
        px={2}
        width="100%"
        justifyContent="space-between"
        border="1px solid"
        borderRadius="8px"
      >
        <Input
          disableUnderline
          value={searchInfo}
          onChange={(e) => setSearchInfo(e.target.value)}
          sx={{ width: "85%", border: "px solid red" }}
          placeholder="Type username or email"
        />
        <IconButton
          type="submit"
          aria-label="search"
          sx={{ width: "10%", p: 2 }}
          disabled={addButtonLoading}
          onClick={handleAddNewUser}
        >
          {addButtonLoading ? <CircularProgress /> : <PersonAdd />}
        </IconButton>
      </Box>
      <Box display="flex" width="100%">
        <List
          sx={{
            width: "100%",
          }}
        >
          {roomUsers?.map((user, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  onClick={() => handleRemoveUser(user)}
                >
                  {willBeDeleted === user.id ? (
                    <CircularProgress />
                  ) : (
                    <RemoveCircleOutline />
                  )}
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar></Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{ flexGrow: 1 }}
                primary={user.name}
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
