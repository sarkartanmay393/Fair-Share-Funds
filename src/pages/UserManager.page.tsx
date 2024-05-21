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
import { Statement } from "@/utils/masterSheet.ts";
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

  const { user, rooms } = useStoreState((state) => state);
  const { setAppbarTitle } = useStoreActions((actions) => actions);

  const [willBeDeleted, setWillBeDeleted] = useState("");
  const [searchInfo, setSearchInfo] = useState("");
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [roomUsers, setRoomUsers] = useState<UserData[]>([]);
  const [, setDeleteButtonLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  useEffect(() => {
    setLoading(true);
    const cr = rooms.find((r) => r.id === roomId);
    if (cr) {
      setCurrentRoom(cr);
      setAppbarTitle(cr.name || "FSF Room Manager");
      const getUserDetails = async () => {
        console.log("Fetch User Details ManagePage");
        const { data, error } = await supabase
          .from("users")
          .select(`*`)
          .in("id", cr.users_id);

        if (error) {
          console.log(error.message);
          setLoading(false);
          return;
        }

        console.log("Loaded User Details ManagePage");
        setLoading(false);
        setRoomUsers(data);
      };

      getUserDetails();

      return () => {
        setAppbarTitle("Fair Share Funds");
      };
    }
  }, []);

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

      if (currentRoom.users_id.indexOf(resp.data.id) !== -1) {
        window.alert(`User already in the room!`);
        setAddButtonLoading(false);
        return;
      }

      // currently adding user will have newStatement
      const currentStatement = currentRoom.master_sheet.getStatement(
        user?.id ?? ""
      );
      if (currentStatement) {
        const newStatement = currentStatement.toJson();
        const newUserStatement = new Statement(newStatement);
        newUserStatement.setAmount(user?.id ?? "", "0");
        currentRoom.master_sheet.setStatement(resp.data.id, newUserStatement);
      }

      roomUsers.forEach((u) => {
        let tmp = currentRoom.master_sheet.getStatement(u.id);
        if (!tmp) tmp = new Statement();
        tmp.setAmount(resp.data.id, "0");
        currentRoom.master_sheet.setStatement(u.id, tmp);
      });

      const { error } = await supabase
        .from("users")
        .update({ rooms_id: [...resp.data.rooms_id, roomId] })
        .eq("id", resp.data.id);
      if (error) {
        // alert(error.message);
        setAddButtonLoading(false);
        return;
      }

      await supabase
        .from("rooms")
        .update({
          users_id: [...currentRoom.users_id, resp?.data.id],
          master_sheet: currentRoom.master_sheet.toJson(),
        })
        .eq(`id`, roomId);
      // alert(error.message);

      setRoomUsers((pr) => [...pr, resp.data as UserData]);
      setAddButtonLoading(false);
      setSearchInfo("");
    };

    await handleSupabaseOperations();
  };

  const handleRemoveUser = (user: UserData) => {
    setWillBeDeleted(user.id);
    setDeleteButtonLoading(true);

    const handleSupabaseOperations = async () => {
      if (!currentRoom?.master_sheet) return;
      roomUsers?.forEach((u) => {
        let tmp = currentRoom?.master_sheet.getStatement(u.id);
        if (!tmp) tmp = new Statement();
        tmp.removeEntry(user.id);
      });
      currentRoom.master_sheet.removeStatement(user.id);

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
        .update({
          users_id: updateUsersId,
          master_sheet: currentRoom.master_sheet.toJson(),
        })
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
