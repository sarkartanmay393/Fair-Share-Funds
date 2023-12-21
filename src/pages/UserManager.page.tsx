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
import { User } from "../interfaces/index.ts";
import { useStoreActions } from "../store/typedHooks.ts";
import { useSupabaseContext } from "../provider/supabase/useSupabase.ts";
import { useEffect } from "react";
import { useCurrentRoomData } from "../utils/useCurrentRoomData.ts";
import { RemoveCircleOutline } from "@mui/icons-material";
import AddUserInput from "@/components/Manage/AddUserInput.tsx";
import { Statement } from "@/utils/masterSheet.ts";

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

  const { supabase, session } = useSupabaseContext();
  const { setAppbarTitle } = useStoreActions((actions) => actions);

  const [willBeDeleted, setWillBeDeleted] = useState("");
  const [searchInfo, setSearchInfo] = useState("");
  const [addButtonLoading, setAddButtonLoading] = useState(false);
  const [roomUsers, setRoomUsers] = useState<User[] | undefined>();
  const [, setDeleteButtonLoading] = useState(false);

  const { currentRoomData } = useCurrentRoomData();
  const ms = currentRoomData?.master_sheet;

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
        resp?.error.message;
        setAddButtonLoading(false);
        return;
      }

      if (currentRoomData?.users_id.indexOf(resp?.data.id) !== -1) {
        // alert(`User already in the room!`);
        setAddButtonLoading(false);
        return;
      }

      if (!ms) return;
      // currently adding user will have newStatement
      const currentStatement = ms.getStatement(session?.user.id || "");
      const newStatement = currentStatement?.toJson();
      const newUserStatement = new Statement(newStatement);
      newUserStatement.setAmount(session?.user.id || "", "0");
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
          users_id: [...currentRoomData.users_id, resp?.data.id],
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

  const handleRemoveUser = (user: User) => {
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

      const updateUsersId = currentRoomData?.users_id.filter(
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

  return (
    currentRoomData?.created_by === session?.user.id && (
      <Box sx={{ ...styles.container }}>
        <Grid container mb={2} width="100%" justifyContent="center">
          <Typography variant="h6" component="h2" fontWeight={600}>
            Manager Room Users
          </Typography>
        </Grid>
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
    )
  );
}
