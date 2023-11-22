import { Box } from "@mui/material";
import WhiteboardBG from '../assets/board-bg-white.png'

const style = {
  width: '100%',
  height: '100%',
  bgcolor: 'primary.contrast',
  border: '2px solid #000',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  padding: '0 1rem 1rem 1rem',
  backgroundImage: `url(${WhiteboardBG})`
};

interface IWhiteBoard {
}

export const WhiteBoard = ({ }: IWhiteBoard) => {

  return (
    <Box sx={{ ...style }}>
    </Box>
  );
}