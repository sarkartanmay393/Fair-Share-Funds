import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarGroup,
  Card,
  CircularProgress,
  Grid,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

import { useStoreActions, useStoreState } from "@/store/typedHooks.ts";
import supabase from "@/utils/supabase/supabase.ts";
import { MasterStatement } from "@/utils/masterSheet.ts";

import { Room, UserData } from "../../interfaces/index.ts";
import { User } from "@supabase/supabase-js";

const styles: { [key: string]: SxProps<Theme> } = {
  roomcard: {
    width: "160px",
    height: "120px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "primary.main",
    borderRadius: "8px",
    overflow: "hidden",
    gap: 1,
    cursor: "pointer",
    ":hover": {
      backgroundColor: "primary.dark",
    },
  },
};

export const Rooms = () => {
  const [loading, setLoading] = useState(false);
  const { user, userData, rooms } = useStoreState((state) => state);
  const { setRooms, setUserData } = useStoreActions((actions) => actions);

  useEffect(() => {
    // loads the rooms information to the app
    const loadRooms = async () => {
      console.log("Load Rooms");
      try {
        setLoading(true);
        // console.log("userData", userData);
        if (userData?.rooms_id) {
          const { data, error } = await supabase
            .from("rooms")
            .select()
            .in("id", userData.rooms_id);

          // console.log("LOG", data, error);

          if (error) {
            throw error;
          }

          if (data.length > 0) {
            const rooms: Room[] = data.map((d) => ({
              created_by: d.created_by,
              id: d.id,
              last_updated: d.last_updated,
              master_sheet: new MasterStatement(d.master_sheet),
              name: d.name,
              transactions_id: d.tratransactions_id,
              users_id: d.users_id,
            }));
            setRooms(rooms);
            console.log("Rooms Loaded");
            setLoading(false);
            return;
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (user && userData) {
      loadRooms();
    }
  }, [user, userData]);

  useEffect(() => {
    const userChannel = supabase
      .channel(`user ch ${userData?.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        (payload) => {
          // if (payload.new.id)
          // console.log(payload);
          setUserData(payload.new as UserData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userChannel);
    };
  }, []);

  return (
    <Grid container spacing={1} justifyContent="center">
      {loading ? (
        <CircularProgress />
      ) : rooms.length > 0 ? (
        rooms.map((room, index) => (
          <Grid key={index} item>
            <Link to={{ pathname: `/room/${room.id}` }}>
              <Card sx={styles.roomcard}>
                <AvatarGroup
                  componentsProps={{
                    additionalAvatar: {
                      sx: { width: "24px", height: "24px" },
                    },
                  }}
                >
                  {room.users_id.map((userId) => (
                    <Avatar key={userId} sx={{ width: "24px", height: "24px" }}>
                      <Typography>.</Typography>
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Typography
                  color="black"
                  fontSize={{ xs: "18px" }}
                  sx={{
                    textAlign: "center",
                    flexWrap: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "90%",
                  }}
                >
                  {room.name}
                </Typography>
              </Card>
            </Link>
          </Grid>
        ))
      ) : (
        <Typography>No existing rooms</Typography>
      )}
    </Grid>
  );
};
