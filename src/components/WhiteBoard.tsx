import { Box } from "@mui/material";
import WhiteboardBG from "../assets/board-bg-white.png";
import { useParams } from "react-router-dom";

const style = {
  width: "100%",
  height: "100%",
  bgcolor: "primary.contrast",
  border: "2px solid #000",
  display: "flex",
  flexDirection: "column",
  borderRadius: "8px",
  padding: "0 1rem 1rem 1rem",
  backgroundImage: `url(${WhiteboardBG})`,
};

// interface WhiteBoardProps { }

export const WhiteBoard = () => {
  const { id } = useParams();

  return <Box sx={{ ...style }}></Box>;
};
