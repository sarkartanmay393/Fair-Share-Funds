import React from "react";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { useUser } from "../utils/useUser";

interface IWelcomeBox {
  isLoading: boolean;
  handleOpenBoard: React.MouseEventHandler<HTMLButtonElement>;

}

export const WelcomeBox = ({
  isLoading,
  handleOpenBoard }: IWelcomeBox
) => {
  const { user } = useUser();

  return (
    <React.Fragment>
      <Typography fontSize={32}>
        Hi, {user?.name}
      </Typography>
      <LoadingButton
        loading={isLoading}
        onClick={handleOpenBoard}
        variant="outlined"
        size="large"
        sx={{ fontSize: '1rem', fontWeight: 600, }}
      >
        Open Board
      </LoadingButton>
    </React.Fragment>
  );
}