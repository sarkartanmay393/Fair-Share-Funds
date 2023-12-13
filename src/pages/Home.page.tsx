import React from "react";
import { Box, SxProps, Theme, Typography } from "@mui/material";
import { WelcomeBox } from "../components/WelcomeBox";

const styles: { [key: string]: SxProps<Theme> } = {
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
  }
}

export default function Homepage() {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Box sx={{ ...styles.container }}>
      <Box sx={{ ...styles.header }}>
        <Typography fontSize={{ xs: 18, sm: 24 }} fontWeight={600}>
          Fair Share Funds
        </Typography>
      </Box>
      <Box sx={{ ...styles.body }}>
        <WelcomeBox isLoading={isLoading} />
      </Box>
    </Box>
  );
}