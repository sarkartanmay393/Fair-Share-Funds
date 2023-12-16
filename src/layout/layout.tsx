import { Box, CircularProgress } from "@mui/material";
import { useStoreState } from "../store/typedHooks";
import { useSupabaseContext } from "../provider/supabase/provider";
import { useUserSyncronizer } from "../utils/useUserSyncronizer";
import CustomAppbar from "../components/CustomAppbar";
import React from "react";

interface ILayout {
  children: React.ReactElement;
}

function Layout({ children }: ILayout) {
  return (
    <Box
      width='100vw'
      height='100vh'
      color='white'
      bgcolor='background.paper'
      display='flex'
      flexDirection='column'
      alignItems='center'
      overflow='hidden'
    >
      <CustomAppbar />
      <Box height='100%' width='100%' display='flex' alignItems='center'>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;