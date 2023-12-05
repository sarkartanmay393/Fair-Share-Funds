import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from "./layout/layout";
import Homepage from "./pages/Home.page";
import { AuthModal } from "./pages/Auth.page";
import { useSupabaseContext } from "./provider/supabase/provider";
import { WhiteBoard } from "./components/WhiteBoard";
import RoomPage from "./pages/Room.page";

function App() {
  const { user } = useSupabaseContext();

  return (
    <Layout>
      <BrowserRouter>
        {user?.id === undefined && <Navigate to='/auth' />}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<AuthModal />} />
          {/* <Route path="/rooms" element={<RoomPage />} /> */}
          <Route path="/room/:slug" element={<RoomPage />} />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
