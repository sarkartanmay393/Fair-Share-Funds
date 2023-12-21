import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  AppBar,
  Toolbar,
  MenuItem,
  IconButton,
  Typography,
  Avatar,
  Button,
  ListItemIcon,
} from "@mui/material";
import { ExpandMore, AccountCircle, Settings } from "@mui/icons-material";

import { useStoreState } from "../store/typedHooks.ts";
import { useSupabaseContext } from "../provider/supabase/useSupabase.ts";
import { useCurrentRoomData } from "../utils/useCurrentRoomData.ts";

import Logo from "../assets/logo.png";
import BackIcon from "../assets/icons8-back-36.png";

export default function CustomAppbar() {
  const pathname = window.location.pathname;
  const roomId = pathname.split("/")[2];

  const navigate = useNavigate();
  const location = useLocation();
  const { session, supabase } = useSupabaseContext();
  const { appbarTitle } = useStoreState((state) => state);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElExpand, setAnchorElExpand] = useState<HTMLElement | null>(
    null
  );

  const { adminAccess } = useCurrentRoomData();

  const signOut = async () => {
    const resp = await supabase?.auth.signOut();
    if (resp && resp.error) {
      navigate("/auth");
    }
  };

  useEffect(() => {
    setAnchorEl(null);
    setAnchorElExpand(null);
  }, [location.pathname]);

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 0,
        height: { xs: "60px", sm: "64px" },
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          aria-label="logo"
          onClick={() => pathname.length > 1 && navigate(-1)}
        >
          {pathname.length > 1 ? (
            <img width={36} height={36} src={BackIcon} alt="back" />
          ) : (
            <img width={36} height={36} src={Logo} alt="roompay logo" />
          )}
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
                  mt: 1.5,
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
              <MenuItem
                disabled={!adminAccess.current || pathname.includes("manage")}
                onClick={() =>
                  !pathname.includes("manage") && navigate(`${pathname}/manage`)
                }
              >
                {adminAccess.current ? (
                  <>
                    <Avatar />
                    Manage Users{" "}
                  </>
                ) : (
                  <>No Admin Access!</>
                )}
              </MenuItem>
              {!adminAccess.current && (
                <MenuItem onClick={() => window.location.reload()}>
                  Window Reload
                </MenuItem>
              )}
              {/* <Divider /> */}
              <MenuItem disabled onClick={() => setAnchorEl(null)}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
            </Menu>
          </div>
        )}

        {session ? (
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
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>Profile</MenuItem>
              <MenuItem onClick={signOut}>Log Out</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button variant="text">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
