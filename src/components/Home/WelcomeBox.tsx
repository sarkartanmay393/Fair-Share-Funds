import {
  Box,
  Typography,
} from "@mui/material";

import {  useStoreState } from "../../store/typedHooks";
import LandingAvatar from "../../assets/landing-avatar.svg";


export const WelcomeBox = () => {
  const { user } = useStoreState((state) => state);

  return (
    <Box
      width="100%"
      mt={6}
      px={2}
      display="flex"
      bgcolor="#89a7d9"
      borderRadius="100px 8px 80px 8px"
      alignItems="center"
    >
      <img src={LandingAvatar} alt="fsf landing page avatar" />
      <Typography fontWeight={600} fontSize={{ xs: 26, sm: 32 }}>
        Hi, {user?.username}
      </Typography>
    </Box>
  );
};
