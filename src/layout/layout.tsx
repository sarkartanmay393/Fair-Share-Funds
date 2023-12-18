import React from "react";
import { Grid, Toolbar } from "@mui/material";
import CustomAppbar from "../components/CustomAppbar";

interface ILayout {
  children: React.ReactElement;
}

function Layout({ children }: ILayout) {
  return (
    <Grid
      container
      direction="column"
      height="100vh"
      color="white"
      border="px solid red"
    >
      <Grid height="fit-content" item>
        <CustomAppbar />
        <Toolbar />
      </Grid>
      <Grid flex={1} item>
        {children}
      </Grid>
    </Grid>
  );
}

export default Layout;
