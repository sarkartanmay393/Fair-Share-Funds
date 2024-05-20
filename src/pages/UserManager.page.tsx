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
import { Room, UserData } from "../interfaces/index.ts";
import { useStoreActions, useStoreState } from "../store/typedHooks.ts";
import { useEffect } from "react";
import { RemoveCircleOutline } from "@mui/icons-material";
import AddUserInput from "@/components/Manage/AddUserInput.tsx";
import { MasterStatement, Statement } from "@/utils/masterSheet.ts";
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

        const cRoom: Room = {
          created_by: data.created_by,
          id: data.id,
          last_updated: data.last_updated,
          master_sheet: new MasterStatement(data.master_sheet),
          name: data.name,
          transactions_id: data.tratransactions_id,
          users_id: data.users_id,
        };

        setCurrentRoom(cRoom);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchCurrentRoom();
  }, [roomId]);

  useEffect(() => {
    setAppbarTitle(currentRoom?.name || "FSF Room Manager");
    const getUserDetails = async () => {
      const resp = await supabase
        .from("users")
        .select(`*`)
        .in("id", currentRoom?.users_id || []);

      if (resp && resp.error) {
        return;
      }
      setRoomUsers(resp && resp.data);
    };

    getUserDetails();

    return () => {
      setAppbarTitle("Fair Share Funds");
    };
  }, [currentRoom]);

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
        resp?.error.message;
        setAddButtonLoading(false);
        return;
      }

      if (currentRoom?.users_id.indexOf(resp?.data.id) !== -1) {
        // alert(`User already in the room!`);
        setAddButtonLoading(false);
        return;
      }

      if (!ms) return;
      // currently adding user will have newStatement
      const currentStatement = ms.getStatement(user?.id || "");
      const newStatement = currentStatement?.toJson();
      const newUserStatement = new Statement(newStatement);
      newUserStatement.setAmount(user?.id || "", "0");
      ms.setStatement(resp.data.id, newUserStatement);

      roomUsers?.forEach((u) => {
        let tmp = ms.getStatement(u.id);
        if (!tmp) tmp = new Statement();
        tmp.setAmount(resp.data.id, "0");
        ms.setStatement(u.id, tmp);
      });

      supabase
        ?.from("users")
        .update({ rooms_id: [...resp.data.rooms_id, roomId] })
        .eq("id", resp?.data.id)
        .then(({ error }) => {
          if (error) {
            // alert(error.message);
            setAddButtonLoading(false);
            return;
          }
        });

      supabase
        ?.from("rooms")
        .update({
          users_id: [...currentRoom.users_id, resp?.data.id],
          master_sheet: ms.toJson(),
        })
        .eq(`id`, roomId)
        .then(({ error }) => {
          if (error) {
            // alert(error.message);
            setAddButtonLoading(false);
            return;
          }
        });

      setAddButtonLoading(false);
      setSearchInfo("");
    };

    handleSupabaseOperations().then(() => setAddButtonLoading(false));
  };

  const handleRemoveUser = (user: UserData) => {
    setWillBeDeleted(user.id);
    setDeleteButtonLoading(true);

    const handleSupabaseOperations = async () => {
      if (!ms) return;
      roomUsers?.forEach((u) => {
        let tmp = ms.getStatement(u.id);
        if (!tmp) tmp = new Statement();
        tmp.removeEntry(user.id);
      });
      ms.removeStatement(user.id);

      const updateRoomsId = user.rooms_id?.filter((id) => id !== roomId);
      const resp = await supabase
        ?.from("users")
        .update({ rooms_id: updateRoomsId })
        .eq("id", user.id);
      if (resp && resp.error) {
        // alert(resp.error);
        setWillBeDeleted("");
        setDeleteButtonLoading(false);
        return;
      }

      const updateUsersId = currentRoom?.users_id.filter(
        (id) => id !== user.id
      );
      const resp2 = await supabase
        ?.from("rooms")
        .update({ users_id: updateUsersId, master_sheet: ms.toJson() })
        .eq("id", roomId);
      if (resp2 && resp2.error) {
        // alert(resp2.error);
        setWillBeDeleted("");
        setDeleteButtonLoading(false);
        return;
      }

      setWillBeDeleted("");
      setDeleteButtonLoading(false);
    };

    handleSupabaseOperations().then(() => {
      setWillBeDeleted("");
      setDeleteButtonLoading(false);
    });
  };

  if (currentRoom?.created_by !== user?.id) {
    window.location.pathname = `/room/${currentRoom?.id}`;
    return;
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
          marginTop={8}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {" "}
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
                <Typography sx={{ color: "GrayText" }}>
                  No other member found 🤦🏽‍♂️
                </Typography>
              )}
            </List>
          </Box>
        </>
      )}
    </Box>
  );
}
