import React from "react";
import { Box, Typography } from "@mui/material";

import { WhiteBoard } from "../components/WhiteBoard";

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: '64px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    width: '100%',
    height: 'calc(100% - 64px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
}

export default function RoomPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Box sx={{ ...styles.container }}>
      <Box sx={{ ...styles.header }}>
        <Typography fontSize={24} fontWeight={600}>
          Rooms1
        </Typography>
      </Box>
      <Box sx={{ ...styles.body }}>
        <WhiteBoard />
      </Box>
    </Box>
  );
}