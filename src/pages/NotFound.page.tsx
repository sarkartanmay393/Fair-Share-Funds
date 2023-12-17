import { Box, SxProps, Theme, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const styles: { [key: string]: SxProps<Theme> } = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default function NotFoundPage() {
  return (
    <Box sx={{ ...styles.container }}>
      <Typography variant="h6" component="h2">
        Page Not Found: 404
      </Typography>
      <Link to={"/"}>Back to Home</Link>
    </Box>
  );
}
