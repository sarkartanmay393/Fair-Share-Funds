import { Grid } from "@mui/material";
import CustomAppbar from "../components/CustomAppbar";
import React from "react";

interface ILayout {
  children: React.ReactElement;
}

function Layout({ children }: ILayout) {
  return (
    <Grid
      container
      width="100vw"
      height="100vh"
      color="white"
      overflow="hidden"
    >
      <Grid
        item
        width="100%"
        height={{ xs: "60px", sm: "64px" }}
        overflow="hidden"
      >
        <CustomAppbar />
      </Grid>
      <Grid flex={1} item height="100%" width="100%">
        {children}
      </Grid>
    </Grid>
  );
}

export default Layout;
