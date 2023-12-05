import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from "./layout/layout";
import Homepage from "./pages/Home.page";
import { AuthModal } from "./pages/Auth.page";
import { useSupabaseContext } from "./provider/supabase/provider";
import { WhiteBoard } from "./components/WhiteBoard";

function App() {
  const { user } = useSupabaseContext();

  return (
    <Container maxWidth='bigdisplay'>
      <Layout>
        <BrowserRouter>
          {user?.id === undefined && <Navigate to='/auth' />}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<AuthModal />} />
            <Route path="/room/:id" element={<WhiteBoard />} />
          </Routes>
        </BrowserRouter>
      </Layout>
    </Container>
  );
}

export default App;
