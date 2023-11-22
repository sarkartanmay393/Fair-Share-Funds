
import { AuthModal } from "./components/AuthModal";
import { useUser } from "./utils/useUser";
import Layout from "./layout/layout";
import Homepage from "./pages/Home.page";
import { Container, CssBaseline } from "@mui/material";
import React from "react";

function App() {
  const { isAuthenticated } = useUser();
  const [open, setOpen] = React.useState(!isAuthenticated);

  return (
    <Container maxWidth='bigdisplay'>
      <CssBaseline enableColorScheme />
      <Layout>
        <React.Fragment>
          {isAuthenticated
            ? <Homepage />
            : <AuthModal open={open} setOpen={setOpen} />
          }
        </React.Fragment>
      </Layout>
    </Container>
  );
}

export default App;
