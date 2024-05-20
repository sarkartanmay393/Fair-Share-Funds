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
import { MasterStatement } from "@/utils/masterSheet.ts";

import { Room } from "../../interfaces/index.ts";

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, userData } = useStoreState((state) => state);

  useEffect(() => {
    // loads the rooms information to the app
    const loadRooms = async () => {
      // console.log("loadRooms");
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
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (user) loadRooms();
  }, [user, userData?.rooms_id]);

  useEffect(() => {
    const roomsChannel = supabase
      .channel(`rooms_ch ${userData?.username}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "rooms" },
        (payload) => {
          // console.log(payload);
          const newRoom: Room = {
            created_by: payload.new.created_by,
            id: payload.new.id,
            last_updated: payload.new.last_updated,
            master_sheet: new MasterStatement(payload.new.master_sheet),
            name: payload.new.name,
            transactions_id: payload.new.tratransactions_id,
            users_id: payload.new.users_id,
          };
          setRooms((pr) => [...pr, newRoom]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
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
