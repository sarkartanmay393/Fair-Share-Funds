import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/layout.tsx";
import Homepage from "./pages/Home.page.tsx";
import { AuthPage } from "./pages/Auth.page.tsx";
import RoomPage from "./pages/Room.page.tsx";
import { Box, CircularProgress } from "@mui/material";
import NotFoundPage from "./pages/NotFound.page.tsx";
// import RoomUserManager from "./pages/UserManager.page.tsx";
import { useUserActions } from "./utils/useUserActions.ts";
import { useStoreState } from "./store/typedHooks.ts";
import { useEffect } from "react";

function App() {
  const { user } = useStoreState((state) => state);
  const { isLoading, loadCurrentUserData } = useUserActions();

  useEffect(() => {
    if (user) {
      loadCurrentUserData().then(() => {
        console.log("User Data Loaded");
      });
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Layout>
        {isLoading ? (
          <Box
            display="flex"
            width="100%"
            justifyContent="center"
            marginTop={6}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {user === null && <Navigate to="/auth" />}
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<AuthPage />} />

              <Route path="/room/:id">
                <Route index element={<RoomPage />} />
                {/* <Route path="manage" element={<RoomUserManager />} /> */}
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </>
        )}
      </Layout>
    </BrowserRouter>
  );
}

export default App;
