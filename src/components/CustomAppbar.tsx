import { useState } from 'react';

import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useStoreState } from '../store/typedHooks';
import { useSupabaseContext } from '../provider/supabase/provider';
import { Avatar, Button, Divider, ListItemIcon } from '@mui/material';

import Logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { PersonAdd, Settings, Logout } from '@mui/icons-material';

export default function CustomAppbar() {
  const pathname = window.location.pathname;
  const isRoomPage = pathname.includes('/room/');
  const { session, supabase } = useSupabaseContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElExpand, setAnchorElExpand] = useState<HTMLElement | null>(null);
  const { appbarTitle } = useStoreState((state) => state);
  const navigate = useNavigate();

  const handleClose = () => setAnchorEl(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const signOut = async () => {
    const resp = await supabase?.auth.signOut();
    if (!resp?.error) {
      navigate('/auth');
    }
  };

  return (
    <AppBar position="static" sx={{ maxHeight: { xs: '60px', sm: '64px' } }} >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{}}
          href={isRoomPage ? '' : '/'}
          onClick={(event) => {
            if (isRoomPage) {
              setAnchorElExpand(event.currentTarget);
            }
          }}
        >
          {isRoomPage ?
            <ExpandMoreIcon /> :
            <img width={36} src={Logo} alt='fair share funds logo' />
          }
        </IconButton>
        <Menu
          anchorEl={anchorElExpand}
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
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar /> My account
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Add another account
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {appbarTitle}
        </Typography>

        {session ?
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
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
              onClose={handleClose}
            >
              <MenuItem disabled onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={signOut}>Log Out</MenuItem>
            </Menu>
          </div> :
          <Button variant='text'>Login</Button>}

      </Toolbar>
    </AppBar>
  );
}