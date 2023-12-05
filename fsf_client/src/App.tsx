import Layout from "./layout/layout";
import { Container } from "@mui/material";
import { useState } from "react";
import { useSupabaseContext } from "./provider/supabase/provider";
import { AuthModal } from "./components/AuthModal";
import Homepage from "./pages/Home.page";

function App() {
  const { user } = useSupabaseContext();
  const [showAuthModal, setShowAuthModal] = useState(user?.id === undefined);

  return (
    <Container maxWidth='bigdisplay'>
      <Layout>
        {showAuthModal ?
          <AuthModal open={showAuthModal} setOpen={setShowAuthModal} />
          : <Homepage />}
      </Layout>
    </Container>
  );
}

export default App;
