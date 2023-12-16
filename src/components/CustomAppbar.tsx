import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import { Settings } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Button, ListItemIcon } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useStoreState } from '../store/typedHooks';
import { useSupabaseContext } from '../provider/supabase/provider';
import Logo from '../assets/logo.png';

export default function CustomAppbar() {
  const pathname = window.location.pathname;
  const roomId = pathname.split('/')[2];

  const navigate = useNavigate();
  const location = useLocation();
  const { session, supabase } = useSupabaseContext();
  const { appbarTitle, rooms } = useStoreState((state) => state);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElExpand, setAnchorElExpand] = useState<HTMLElement | null>(null);

  let currentRoom = roomId ? rooms?.find((r) => r.id === roomId) : undefined;
  let adminAccess = currentRoom ? currentRoom?.created_by === session!.user.id : false;

  const signOut = async () => {
    const resp = await supabase?.auth.signOut();
    if (resp && resp.error) {
      navigate('/auth');
    }
  };

  useEffect(() => {
    setAnchorEl(null);
    setAnchorElExpand(null);
  }, [location.pathname]);

  return (
    <AppBar position="static" sx={{ maxHeight: { xs: '60px', sm: '64px' } }} >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{}}
          // href={pathname.length > 1 ? '' : '/'}
          onClick={() => {
            if (pathname.length > 1) {
              navigate(-1);
            }
          }}
        >
          {pathname.length > 1 ?
            <ArrowBackIosNewIcon /> :
            <img width={36} src={Logo} alt='fair share funds logo' />
          }
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {appbarTitle}
        </Typography>

        {roomId &&
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
              <ExpandMoreIcon />
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
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled={pathname.includes('manage') || !adminAccess} onClick={() => !pathname.includes('manage') && navigate(`${pathname}/manage`)}>
                <Avatar /> Manage Users
              </MenuItem>
              {/* <Divider /> */}
              <MenuItem disabled onClick={() => setAnchorEl(null)}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
            </Menu>
          </div>}

        {session ?
          <div>
            <IconButton
              size="large"
              color="inherit"
              aria-haspopup="true"
              aria-controls="account-control"
              aria-label="account of current user"
              onClick={(event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="account-control-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>Profile</MenuItem>
              <MenuItem onClick={signOut}>Log Out</MenuItem>
            </Menu>
          </div> :
          <Button variant='text'>Login</Button>}

      </Toolbar>
    </AppBar>
  );
}