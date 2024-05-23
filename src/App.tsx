import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/layout.tsx";
import Homepage from "./pages/Home.page.tsx";
import { AuthPage } from "./pages/Auth.page.tsx";
import RoomPage from "./pages/Room.page.tsx";
import NotFoundPage from "./pages/NotFound.page.tsx";
import RoomUserManager from "./pages/UserManager.page.tsx";
// import { useUserActions } from "./utils/useUserActions.ts";
import { useStoreActions, useStoreState } from "./store/typedHooks.ts";
import { useEffect, useState } from "react";
import supabase from "./utils/supabase/supabase.ts";
import { UserData } from "./interfaces/index.ts";
import { CircularProgress } from "@mui/material";
// import { useEffect } from "react";

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
          <CircularProgress />
        ) : (
          <>
            {!user && !userData && <Navigate to="/auth" />}
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<AuthPage />} />

              <Route path="/room/:id">
                <Route index element={<RoomPage />} />
                <Route path="manage" element={<RoomUserManager />} />
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
