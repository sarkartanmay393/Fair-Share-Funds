import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  AppBar,
  Toolbar,
  MenuItem,
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { ExpandMore, AccountCircle, Delete } from "@mui/icons-material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { useStoreActions, useStoreState } from "../store/typedHooks.ts";

import Logo from "../assets/logo.png";
import BackIcon from "../assets/icons8-back-36.png";
import supabase from "@/utils/supabase/supabase.ts";

export default function CustomAppbar() {
  const pathname = window.location.pathname;
  const roomId = pathname.split("/")[2];

  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElExpand, setAnchorElExpand] = useState<HTMLElement | null>(
    null
  );

  const { appbarTitle, user, isAdmin } = useStoreState((state) => state);
  const { resetStore } = useStoreActions((action) => action);

  const [logOutLoading, setLogOutLoading] = useState(false);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const signOut = async () => {
    setLogOutLoading(true);
    try {
      await supabase.auth.signOut();
      resetStore();
      setLogOutLoading(false);
    } catch (error) {
      console.log(error);
      setLogOutLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    setDeletingLoading(true);
    try {
      await supabase.from("transactions").delete().eq("room_id", roomId);
      await supabase.from("statements").delete().eq("roomId", roomId);
      const { data: roomToBeDeleted, error: roomError } = await supabase
        .from("rooms")
        .select()
        .eq("id", roomId)
        .single();

      if (roomError) throw roomError;

      if (roomToBeDeleted) {
        const promises = roomToBeDeleted.users_id.map(
          async (userId: string) => {
            const { data: currentUser } = await supabase
              .from("users")
              .select()
              .eq("id", userId)
              .single();

            const updatedRoomIds = currentUser?.rooms_id?.filter(
              (id: string) => id !== roomToBeDeleted.id
            );

            const { error: updateUserError } = await supabase
              .from("users")
              .update({
                rooms_id: updatedRoomIds,
              })
              .eq("id", userId);

            if (updateUserError) {
              throw updateUserError;
            }
          }
        );

        await Promise.all(promises);
        await supabase.from("rooms").delete().eq("id", roomId);

        console.log("sending broadcast delete room");
        await supabase.channel(`room delete ch`).send({
          type: "broadcast",
          event: "room-delete",
          payload: { id: roomToBeDeleted.id },
        });

        navigate("/");
      } else {
        throw new Error("Current Room not found!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingLoading(false);
    }
  };

  useEffect(() => {
    setAnchorEl(null);
    setAnchorElExpand(null);
  }, [location.pathname]);

  return (
    <AppBar>
      <Toolbar>
        <IconButton
          size="small"
          edge="start"
          aria-label="logo"
          onClick={() => pathname.length > 1 && navigate(-1)}
        >
          {pathname.length > 1 ? (
            <img width={30} height={30} src={BackIcon} alt="back" />
          ) : (
            <img width={30} height={30} src={Logo} alt="roompay logo" />
          )}
        </IconButton>

        <Typography
          variant="h1"
          fontWeight={600}
          sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }}
        >
          {appbarTitle}
        </Typography>

        {roomId && (
          <div>
            <IconButton
              size="large"
              // edge="start"
              color="inherit"
              aria-label="room--control-more"
              sx={{}}
              onClick={(event: React.MouseEvent<HTMLElement>) =>
                setAnchorElExpand(event.currentTarget)
              }
            >
              <ExpandMore />
            </IconButton>
            <Menu
              anchorEl={anchorElExpand}
              aria-haspopup="true"
              id="room-control-menu"
              open={Boolean(anchorElExpand)}
              onClose={() => setAnchorElExpand(null)}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {isAdmin ? (
                <MenuItem
                  sx={{
                    display: pathname.includes("manage") ? "none" : "flex",
                  }}
                  disabled={!isAdmin}
                  onClick={() =>
                    !pathname.includes("manage") &&
                    navigate(`${pathname}/manage`)
                  }
                >
                  <ManageAccountsIcon fontSize="small" sx={{ mr: 0.75 }} />
                  <Typography fontSize={14}>Manage Users</Typography>
                </MenuItem>
              ) : null}
              {isAdmin ? (
                <MenuItem disabled={deletingLoading} onClick={handleDeleteRoom}>
                  <Delete fontSize="small" sx={{ mr: 0.75 }} />
                  {deletingLoading ? (
                    <CircularProgress />
                  ) : (
                    <Typography fontSize={14}>Delete Room</Typography>
                  )}
                </MenuItem>
              ) : null}
              {/* <Divider /> */}
              {/* <MenuItem disabled onClick={() => setAnchorEl(null)}>
                <TuneIcon fontSize="small" sx={{ mr: 0.75 }} />
                Settings
              </MenuItem> */}
            </Menu>
          </div>
        )}

        {user ? (
          <div>
            <IconButton
              size="large"
              color="inherit"
              aria-haspopup="true"
              aria-controls="account-control"
              aria-label="account of current user"
              onClick={(event: React.MouseEvent<HTMLElement>) =>
                setAnchorEl(event.currentTarget)
              }
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="account-control-menu"
              anchorEl={anchorEl}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem
                onClick={() =>
                  window.navigator.clipboard.writeText(user.email ?? "")
                }
              >
                {user.email}
              </MenuItem>
              <MenuItem disabled={logOutLoading} onClick={signOut}>
                {logOutLoading ? <CircularProgress /> : "Log Out"}
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Button variant="text">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
