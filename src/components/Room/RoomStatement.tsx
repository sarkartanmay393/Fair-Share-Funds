import React, { useEffect, useState } from "react";
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
import { useStoreState } from "@/store/typedHooks";
import { Statement, UserData } from "@/interfaces";
import supabase from "@/utils/supabase/supabase";

interface RoomStatementProps {
  roomUsers: UserData[];
}

const RoomStatement = ({ roomUsers }: RoomStatementProps) => {
  const pathname = window.location.pathname;
  const roomId = pathname.split("/")[2];

  const { user } = useStoreState((state) => state);
  const [statements, setStatements] = useState<Statement[]>([]);

  const fetchRoomByUserIdAndRoomId = async (userId: string, roomId: string) => {
    const { data, error } = await supabase
      .from("statements")
      .select()
      .eq("roomId", roomId)
      .contains("users", [userId])
      .single();

    if (error) {
      console.error("Error fetching room:", error);
      return null;
    }

    return data as Statement;
  };

  useEffect(() => {
    const loadAllStatements = async () => {
      const temp = roomUsers.map(async (user) => {
        return await fetchRoomByUserIdAndRoomId(user.id, roomId);
      });
      const allStatements = await Promise.all(temp);
      const cleaned: Statement[] = [];
      allStatements.forEach((s) => {
        if (s) cleaned.push(s);
      });
      setStatements(cleaned);
    };
    if (!statements.length) {
      loadAllStatements();
    }
  }, [roomUsers]);

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
              roomUsers.map((u, index) => {
                const name = u.name;
                const amount = Number(statement?.getAmount(u.id) || 0);
                if (u.id === user?.id) {
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
                        <Typography
                          sx={{ fontSize: "15px", fontWeight: "600" }}
                        >
                          Rs. {amount}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography
                textAlign="center"
                variant="body1"
                sx={{ opacity: 0.7 }}
              >
                No users in the room
              </Typography>
            )
          ) : (
            <Typography>No room statement found</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
export default RoomStatement;
