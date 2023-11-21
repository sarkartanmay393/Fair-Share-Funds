import { Box, Typography } from "@mui/material";

import { AuthModal } from "./components/AuthModal";
import { WhiteBoard } from "./components/WhiteBoard";
import { useStoreActions, useStoreState } from "./store/typedHooks";
import { useEffect } from "react";
import { User } from "./interfaces";
import React from "react";

function App() {
  const { user } = useStoreState((state) => state);
  const { setUser } = useStoreActions((action) => action);
  const [open, setOpen] = React.useState(Boolean(user));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await fetch('/api/user', { method: "GET" });
        if (resp.status === 400) { return setOpen(true) }
        const userData = await resp.json() as User;
        setUser(userData);
      } catch (e) {
        console.error(e)
      }
    }

    fetchUser();
  }, [])


  return (
    <Box width='100vw' height='100vh' color='white' bgcolor='background.paper'
      display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Typography fontSize={32}>{user && 'Authenticated!'}</Typography>
      {user ? <WhiteBoard /> : <></>}
      <AuthModal open={open} setOpen={setOpen} />
    </Box >
  );
}

export default App;
