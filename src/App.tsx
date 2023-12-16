import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from "./layout/layout";
import Homepage from "./pages/Home.page";
import { AuthPage } from "./pages/Auth.page";
import RoomPage from "./pages/Room.page";
import { useSupabaseContext } from './provider/supabase/provider';
import { useUserSyncronizer } from './utils/useUserSyncronizer';
import { CircularProgress } from '@mui/material';

function App() {
  const { session } = useSupabaseContext();
  const { isLoading } = useUserSyncronizer();

  return (
    <Layout>
      {isLoading ? <CircularProgress /> :
        <BrowserRouter>
          {session === null && <Navigate to='/auth' />}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* <Route path="/rooms" element={<RoomPage />} /> */}
            <Route path="/room/:id" element={<RoomPage />} />
          </Routes>
        </BrowserRouter>}
    </Layout>
  );
}

export default App;
