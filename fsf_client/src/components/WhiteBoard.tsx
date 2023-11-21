import { Box } from "@mui/material";

const style = {
  width: '100%',
  height: '100%',
  bgcolor: 'primary.main',
  border: '2px solid #000',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px'
};

interface IWhiteBoard {
}

export const WhiteBoard = ({ }: IWhiteBoard) => {

  return (
    <Box sx={{ ...style }}>
    </Box>
  );
}