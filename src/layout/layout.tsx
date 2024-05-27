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
        width: "100dvw",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        color: "white",
        overflow: "hidden",

        // border: "10px solid green",
      }}
    >
      <Box
        height={{ xs: "60px", sm: "64px" }}
        minHeight={{ xs: "60px", sm: "64px" }}
      >
        <CustomAppbar />
      </Box>
      <Box flex={1} sx={{ overflowY: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
