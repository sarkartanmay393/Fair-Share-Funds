import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

const Layout = lazy(() => import("./layout/layout.tsx"));
const Homepage = lazy(() => import("./pages/Home.page.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.page.tsx"));
const RoomPage = lazy(() => import("./pages/Room.page.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFound.page.tsx"));
const RoomUserManager = lazy(() => import("./pages/UserManager.page.tsx"));

import { useStoreActions, useStoreState } from "./store/typedHooks.ts";
import supabase from "./utils/supabase/supabase.ts";
import { UserData } from "./interfaces/index.ts";

function App() {
  const [loading, setLoading] = useState(true);
  const { user, userData } = useStoreState((state) => state);
  const { setUser, setUserData } = useStoreActions((action) => action);

  useEffect(() => {
    const loadAuthData = async () => {
      console.log("Fetch Main Auth");
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setLoading(false);
        return null;
      }
      setUser(data.user);
      console.log("Loaded Main Auth");
    };

    if (!user) {
      loadAuthData();
    }
  }, [user]);

  useEffect(() => {
    const loadUserData = async (userId: string) => {
      console.log("Fetch Main User Data");
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single();

      if (error) {
        setLoading(false);
        return null;
      }

      setLoading(false);
      setUserData(data as UserData);
      console.log("Loaded Main User Data");
    };

    if (user && !userData) {
      loadUserData(user.id);
    }
  }, [user, userData]);

  return (
    <BrowserRouter>
      <Layout>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            <CircularProgress color="info" />
          </Box>
        ) : (
          <>
            {!user && !userData && <Navigate to="/auth" />}
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <Homepage />
                  </Suspense>
                }
              />
              <Route
                path="/auth"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <AuthPage />
                  </Suspense>
                }
              />

              <Route path="/room/:id">
                <Route
                  index
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <RoomPage />
                    </Suspense>
                  }
                />
                <Route
                  path="manage"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <RoomUserManager />
                    </Suspense>
                  }
                />
              </Route>

              <Route
                path="*"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <NotFoundPage />
                  </Suspense>
                }
              />
            </Routes>
          </>
        )}
      </Layout>
    </BrowserRouter>
  );
}

export default App;
