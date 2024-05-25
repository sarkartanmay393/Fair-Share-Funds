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

import { useStoreState } from "@/store/typedHooks.ts";
import supabase from "@/utils/supabase/supabase.ts";

import { PackagedRoom } from "../../interfaces/index.ts";

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
  const [rooms, setRooms] = useState<PackagedRoom[]>([]);
  const { user, userData } = useStoreState((state) => state);

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
            .select(`id, name, users_id`)
            .in("id", userData.rooms_id)
            .order("last_updated", { ascending: false });
          // console.log("LOG", data, error);

          if (error) {
            throw error;
          }

          if (data.length > 0) {
            const rooms: PackagedRoom[] = data.map((d) => ({
              id: d.id,
              name: d.name,
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
      .channel(`${user?.id} selfch`)
      .on(
        "broadcast",
        {
          event: "new-room-creation",
        },
        ({ payload }) => {
          setRooms((p) => [payload, ...p]);
        }
      )
      .subscribe();

    const roomChannel = supabase
      .channel(`room delete ch`)
      .on(
        "broadcast",
        {
          event: "room-delete",
        },
        ({ payload }) => {
          const newRooms = rooms.filter((r) => r.id !== payload.id);
          setRooms(newRooms);
        }
      )
      .subscribe();

    const roomChannel2 = supabase
      .channel(`room ch`)
      .on(
        "broadcast",
        {
          event: "room-add",
        },
        ({ payload }) => {
          if (payload.clientId === user?.id) {
            setRooms((p) => [payload.room, ...p]);
          }
        }
      )
      .on(
        "broadcast",
        {
          event: "room-remove",
        },
        ({ payload }) => {
          if (payload.clientId === user?.id) {
            const existingRooms = rooms.filter((r) => r.id !== payload.roomId);
            setRooms(existingRooms);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userChannel);
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(roomChannel2);
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
                  {room.users_id &&
                    room.users_id.map((userId) => (
                      <Avatar
                        key={userId}
                        sx={{ width: "24px", height: "24px" }}
                      >
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
