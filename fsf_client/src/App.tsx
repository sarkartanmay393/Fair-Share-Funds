import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { AuthModal } from "./components/AuthModal";
import { WhiteBoard } from "./components/WhiteBoard";
import { useStoreState } from "./store/typedHooks";

function App() {
  const theme = useTheme();
  const { user } = useStoreState((state) => state);

  return (
    <Box width='100vw' height='100vh' color='white' bgcolor={theme.palette.background.default}
      display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Typography fontSize={32}>{user && 'Authenticated!'}</Typography>
      <WhiteBoard />
      <AuthModal forceOpen={user ? false : true} />
    </Box >
  );
}

export default App;
