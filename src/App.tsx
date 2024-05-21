import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/layout.tsx";
import Homepage from "./pages/Home.page.tsx";
import { AuthPage } from "./pages/Auth.page.tsx";
import RoomPage from "./pages/Room.page.tsx";
import NotFoundPage from "./pages/NotFound.page.tsx";
import RoomUserManager from "./pages/UserManager.page.tsx";
// import { useUserActions } from "./utils/useUserActions.ts";
import { useStoreActions, useStoreState } from "./store/typedHooks.ts";
import { useEffect } from "react";
import supabase from "./utils/supabase/supabase.ts";
import { UserData } from "./interfaces/index.ts";
// import { useEffect } from "react";

function App() {
  const { user, userData } = useStoreState((state) => state);
  const { setUser, setUserData } = useStoreActions((action) => action);

  const fetchUserData = async (userId: string) => {
    console.log("Fetch Main User Data");
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return null;
    }

    return data as UserData;
  };

  useEffect(() => {
    const fetchAuthData = async () => {
      console.log("Fetch Main Auth");
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return null;
      }
      return data.user;
    };

    const action = async () => {
      const user = await fetchAuthData();
      if (user) {
        setUser(user);
        console.log("Loaded Main Auth");
        const userData = await fetchUserData(user.id);
        setUserData(userData);
        console.log("Loaded Main User Data");
      }
    };

    if (!user) {
      action();
    }
  }, [setUser, setUserData, user]);

  useEffect(() => {
    if (user && !userData) {
      fetchUserData(user.id);
    }
  }, [user, userData]);

  return (
    <BrowserRouter>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  );
}

export default App;
