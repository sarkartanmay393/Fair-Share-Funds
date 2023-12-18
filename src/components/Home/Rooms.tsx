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

import { Room } from "../../interfaces";
import { useSupabaseContext } from "../../provider/supabase/provider";
import { useCurrentUser } from "../../utils/useCurrentUser";

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
  const [rooms, setRooms] = useState<Room[]>();
  const { cUser } = useCurrentUser();
  const { supabase } = useSupabaseContext();

  useEffect(() => {
    // loads the rooms information to the app
    const loadRooms = () => {
      setLoading(true);
      if (cUser?.rooms_id) {
        supabase!
          .from("rooms")
          .select()
          .in("id", cUser.rooms_id)
          .then(({ data, error }) => {
            if (error) {
              setLoading(false);
              return;
            }
            if (data.length > 0) {
              setRooms(data as Room[]);
              setLoading(false);
            }
          });
      }
      setLoading(false);
    };

    loadRooms();
  }, [cUser]);

  return (
    <Grid container spacing={1} justifyContent="center">
      {loading && <CircularProgress />}
      {!loading &&
        rooms &&
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
                <Typography color="black" fontSize={{ xs: "20px", md: "22px" }}>
                  {room.name}
                </Typography>
              </Card>
            </Link>
          </Grid>
        ))}
      {!loading && !rooms && <Typography>No room data</Typography>}
    </Grid>
  );
};
