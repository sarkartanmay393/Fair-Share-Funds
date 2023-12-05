import React from "react";
import { LoadingButton } from "@mui/lab";
import { Box, Typography } from "@mui/material";
import { useUser } from "../utils/useUser";
import { useSupabaseContext } from "../provider/supabase/provider";

interface IWelcomeBox {
  isLoading: boolean;
  handleOpenBoard?: React.MouseEventHandler<HTMLButtonElement>;

}

export const WelcomeBox = ({ isLoading }: IWelcomeBox) => {
  const { user } = useSupabaseContext();

  return (
    <Box>
      <Typography fontSize={32}>
        Hi, {user?.email?.split('@')[0]}
      </Typography>
      {/* <LoadingButton
        href="room"
        loading={isLoading}
        variant="outlined"
        size="large"
        sx={{ fontSize: '1rem', fontWeight: 600, }}
      >
        Open Board
      </LoadingButton> */}
    </Box>
  );
}