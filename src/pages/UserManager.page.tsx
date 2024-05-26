import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { Room, Statement, UserData } from "../interfaces/index.ts";
import { useStoreActions, useStoreState } from "../store/typedHooks.ts";
import { useEffect } from "react";
import { RemoveCircleOutline } from "@mui/icons-material";
import AddUserInput from "@/components/Manage/AddUserInput.tsx";
import supabase from "@/utils/supabase/supabase.ts";

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

  const { user } = useStoreState((state) => state);
  const { setAppbarTitle } = useStoreActions((actions) => actions);

  const [willBeDeleted, setWillBeDeleted] = useState("");
  const [searchInfo, setSearchInfo] = useState("");
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [roomUsers, setRoomUsers] = useState<UserData[]>([]);
  const [, setDeleteButtonLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchCurrentRoom = async () => {
      console.log("Fetching Current Room");
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select()
          .eq("id", roomId)
          .single();

        if (error) {
          throw error;
        }

        console.log("Loaded Current Room " + data?.name);
        setCurrentRoom(data as Room);
        setAppbarTitle(data.name || "RoomPay");
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    if (!currentRoom) {
      fetchCurrentRoom();
    }
  }, [roomId]);

  useEffect(() => {
    const fetchCurrentRoomUsers = async (usersId: string[]) => {
      console.log("Fetch Room Users: " + usersId.length);
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .in("id", usersId);

        if (error) {
          console.log(error.message);
        }

        console.log("Loaded Room Users: " + data?.length);

        setRoomUsers((data as UserData[]) ?? []);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    if (currentRoom?.users_id.length && !roomUsers.length) {
      console.log("Fetch with " + currentRoom?.users_id.length);
      fetchCurrentRoomUsers(currentRoom?.users_id);
    }
  }, [currentRoom, roomUsers.length]);

  const handleAddNewUser = async () => {
    setAddButtonLoading(true);
    const isEmail = searchInfo.includes("@");

    const handleSupabaseOperations = async () => {
      if (!currentRoom) {
        console.log("No current user");
        return;
      }

      const resp = await supabase
        .from("users")
        .select()
        .eq(isEmail ? "email" : "username", searchInfo)
        .single();

      if (resp.error) {
        console.log(resp.error.message);
        setAddButtonLoading(false);
        return;
      }

      if (currentRoom.users_id.indexOf(resp.data.id ?? "") !== -1) {
        window.alert(`User already in the room!`);
        setAddButtonLoading(false);
        return;
      }

      const statements = [] as Partial<Statement>[];

      currentRoom.users_id.map((userId) => {
        statements.push({
          amount: 0,
          roomId: currentRoom.id,
          between: [resp.data.id, userId],
        } as Partial<Statement>);
      });

      const resp2 = await supabase.from("statements").insert(statements);

      if (resp2.error) {
        console.log(resp2.error.message);
        setAddButtonLoading(false);
        return;
      }

      const { error } = await supabase
        .from("users")
        .update({ rooms_id: [...resp.data.rooms_id, roomId] })
        .eq("id", resp.data.id);

      if (error) {
        console.log(error.message);
        setAddButtonLoading(false);
        return;
      }

      const resp3 = await supabase
        .from("rooms")
        .update({
          users_id: [...currentRoom.users_id, resp.data.id],
        })
        .eq(`id`, roomId)
        .select()
        .single();

      if (resp3.error) {
        console.log(resp3.error.message);
        setAddButtonLoading(false);
        return;
      }

      setRoomUsers((pr) => [resp.data as UserData, ...pr]);

      console.log("sending broadcast add user to room");
      await supabase.channel(`global room ch`).send({
        type: "broadcast",
        event: "room-add",
        payload: { clientId: resp.data.id, room: resp3.data },
      });

      setAddButtonLoading(false);
      setSearchInfo("");
    };

    await handleSupabaseOperations();
  };

  const handleRemoveUser = async (user: UserData) => {
    setWillBeDeleted(user.id);
    setDeleteButtonLoading(true);

    const handleSupabaseOperations = async () => {
      if (!currentRoom) return;

      const updateRoomsId = user.rooms_id.filter((id) => id !== roomId);
      const resp = await supabase
        .from("users")
        .update({ rooms_id: updateRoomsId })
        .eq("id", user.id);

      if (resp.error) {
        console.log(resp.error.message);
        setWillBeDeleted("");
        setDeleteButtonLoading(false);
        return;
      }

      const { error } = await supabase
        .from("statements")
        .delete()
        .eq("roomId", currentRoom.id)
        .contains("between", [user.id]);

      if (error) {
        console.log(error.message);
        setWillBeDeleted("");
        setDeleteButtonLoading(false);
        return;
      }

      const updatedRoomUsersId = currentRoom.users_id.filter(
        (id) => id !== user.id
      );

      const resp2 = await supabase
        .from("rooms")
        .update({
          users_id: updatedRoomUsersId,
        })
        .eq("id", roomId);

      if (resp2.error) {
        console.log(resp2.error.message);
        setWillBeDeleted("");
        setDeleteButtonLoading(false);
        return;
      }

      console.log("sending broadcast remove user to room");
      await supabase.channel(`global room ch`).send({
        type: "broadcast",
        event: "room-remove",
        payload: { clientId: user.id, roomId: roomId },
      });

      const exisitngRoomUser = roomUsers.filter((ru) => ru.id !== user.id);
      setRoomUsers(exisitngRoomUser);

      setWillBeDeleted("");
      setDeleteButtonLoading(false);
    };

    await handleSupabaseOperations();
  };

  if (currentRoom) {
    if (currentRoom.created_by !== user?.id) {
      window.location.pathname = `/room/${currentRoom?.id}`;
      return;
    }
  }

  return (
    <Box sx={{ ...styles.container }}>
      <Grid container mb={2} width="100%" justifyContent="center">
        <Typography variant="h6" component="h2" fontWeight={600}>
          Manager Room Users
        </Typography>
      </Grid>
      {loading ? (
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignContent="center"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box width="95%">
          <AddUserInput
            searchInfo={searchInfo}
            setSearchInfo={setSearchInfo}
            addButtonLoading={addButtonLoading}
            handleAddNewUser={handleAddNewUser}
          />
          <Box display="flex" width="100%">
            <List
              sx={{
                width: "100%",
              }}
            >
              {roomUsers.length > 0 ? (
                roomUsers.map((user, index) => (
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
                ))
              ) : (
                <Typography sx={{ color: "GrayText", mt: 2 }}>
                  No other member found 🤦🏽‍♂️
                </Typography>
              )}
            </List>
          </Box>
        </Box>
      )}
    </Box>
  );
}
