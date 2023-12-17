import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MasterStatement = ({
  POVstatement,
  roomUsers,
}: {
  POVstatement?: {
    [userId: string]: number;
  };
  roomUsers?: {
    email: string;
    id: string;
    name: string;
    rooms_id: string[] | null;
    username: string;
  }[];
}) => {

  return (
    <Card
      raised
      sx={{
        position: "fixed",
        top: { xs: "64px", sm: "70px" },
        zIndex: 3,
        borderRadius: 3,
        flexDirection: "column",
        width: "96%",
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<KeyboardArrowDownIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Statement</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {POVstatement &&
            Object.entries(POVstatement).map((entry, index) => (
              <Box
                key={index}
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    paddingX: "15px",
                    paddingY: "10px",
                    border: "px solid red",
                    borderRadius: "8px",
                  }}
                >
                  <Box sx={{ display: "flex", gap: "20px" }}>
                    <Box sx={{}}>
                      <Avatar>D</Avatar>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "15px" }}>
                        {roomUsers?.find((u) => u.id === entry[0])?.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                      {entry[1]}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
export default MasterStatement;
