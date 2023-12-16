import { useState } from 'react';

import Menu from '@mui/material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useStoreState } from '../store/typedHooks';
import { useSupabaseContext } from '../provider/supabase/provider';
import { Button } from '@mui/material';

import Logo from '../assets/logo.png';

interface AppbarProps { }

export default function CustomAppbar() {
  const { session } = useSupabaseContext();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { appbarTitle } = useStoreState((state) => state);

  const handleClose = () => setAnchorEl(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{}}
          href='/'
        >
          {/* <MenuIcon /> */}
          <img width={36} src={Logo} alt='fair share funds logo' />
        </IconButton>

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
              <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu>
          </div> :
          <Button variant='text'>Login</Button>}

      </Toolbar>
    </AppBar>
  );
}