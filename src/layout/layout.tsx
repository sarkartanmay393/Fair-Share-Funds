import React from "react";
import { Box } from "@mui/material";
import CustomAppbar from "../components/CustomAppbar.tsx";

interface ILayout {
  children: React.ReactElement;
}

function Layout({ children }: ILayout) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Box
        height={{ xs: "60px", sm: "64px" }}
        minHeight={{ xs: "60px", sm: "64px" }}
      >
        <CustomAppbar />
      </Box>
      <Box flexGrow={1} sx={{ overflowY: "auto", position: "relative" }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
