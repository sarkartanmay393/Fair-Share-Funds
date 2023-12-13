import { Box } from "@mui/material";

interface ILayout {
  children: JSX.Element;
}

function Layout({ children }: ILayout) {
  return (
    <Box
      width='100vw'
      height='100vh'
      color='white'
      bgcolor='background.paper'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
    >
      {children}
    </Box>
  );
}

export default Layout;