import { Box, SxProps, Theme } from "@mui/material";
import { WelcomeBox } from "../components/WelcomeBox";

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    mt: 6,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingX: 4,
    gap: 8,
    overflow: "scroll",
  },
};

export default function Homepage() {
  return (
    <Box sx={{ ...styles.container }}>
      <WelcomeBox />
    </Box>
  );
}
