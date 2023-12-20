import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/layout.tsx";
import Homepage from "./pages/Home.page.tsx";
import { AuthPage } from "./pages/Auth.page.tsx";
import RoomPage from "./pages/Room.page.tsx";
import { useSupabaseContext } from "./provider/supabase/useSupabase.ts";
import { CircularProgress } from "@mui/material";
import NotFoundPage from "./pages/NotFound.page.tsx";
import RoomUserManager from "./pages/UserManager.page.tsx";
import { useCurrentUser } from "./utils/useCurrentUser.ts";

function App() {
  const { session } = useSupabaseContext();
  const { isLoading } = useCurrentUser();

  return (
    <BrowserRouter>
      <Layout>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {session === null && <Navigate to="/auth" />}
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
