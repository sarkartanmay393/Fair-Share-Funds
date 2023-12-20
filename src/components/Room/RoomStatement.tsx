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
import { Statement } from "@/utils/masterSheet";
import { useSupabaseContext } from "@/provider/supabase/useSupabase";
import React from "react";

interface RoomStatementProps {
  statement?: Statement;
  roomUsers?: {
    email: string;
    id: string;
    name: string;
    rooms_id: string[] | null;
    username: string;
  }[];
}

const RoomStatement = ({ statement, roomUsers }: RoomStatementProps) => {
  const { session } = useSupabaseContext();

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
          {!(roomUsers?.length || 0 > 1) && (
          <Typography textAlign="center" variant="body1" sx={{ opacity: 0.7 }}>
            No users in the room
          </Typography>
          )}
          {roomUsers &&
            roomUsers.map((u, index) => {
              const name = u.name;
              const amount = Number(statement?.getAmount(u.id) || 0);
              if (u.id === session?.user.id) {
                return <React.Fragment key={index}></React.Fragment>;
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
                        <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "15px" }}>
                          {name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "15px", fontWeight: "600" }}>
                        Rs. {amount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
export default RoomStatement;
