import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { AuthModal } from "./components/AuthModal";

function App() {
  const theme = useTheme();


  return (
    <Box width='100vw' height='100vh' color='white' bgcolor={theme.palette.background.default}
      display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Typography fontSize={32}>Authenticated!</Typography>
      <AuthModal />
    </Box >
  );
}

export default App;
