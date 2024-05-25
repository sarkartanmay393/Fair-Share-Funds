import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
// import { useStoreState } from "@/store/typedHooks";
import { Statement, UserData } from "@/interfaces";

interface RoomStatementProps {
  roomUsers: UserData[];
  statements: Statement[];
}

const RoomStatement = ({ roomUsers, statements }: RoomStatementProps) => {
  // const pathname = window.location.pathname;
  // const roomId = pathname.split("/")[2];
  // const { user } = useStoreState((state) => state);

  return (
    <Card
      raised
      sx={{
        border: "0.2px solid grey",
        position: "fixed",
        top: { xs: "64px", sm: "70px" },
        zIndex: 3,
        borderRadius: 3,
        flexDirection: "column",
        width: "95%",
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<KeyboardArrowDown />}
          aria-controls="panel1a-content"
        >
          <Typography>Statement</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {statements.length > 0 ? (
            statements.map((s, index) => {
              const statementSpecificUser = roomUsers.find((ru) =>
                s.users.includes(ru.id)
              );

              if (!statementSpecificUser) {
                return <></>;
              }

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
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
                        <Avatar>
                          {statementSpecificUser.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "15px" }}>
                          {statementSpecificUser.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                        Rs. {s.amount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography>No room statement found</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
export default RoomStatement;
