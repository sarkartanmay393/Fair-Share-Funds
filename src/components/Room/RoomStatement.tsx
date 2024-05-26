import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useStoreState } from "@/store/typedHooks";
import { Statement, UserData } from "@/interfaces";
import { Fragment, useEffect, useState } from "react";
import supabase from "@/utils/supabase/supabase";

interface RoomStatementProps {
  roomUsers: UserData[];
}

const RoomStatement = ({ roomUsers }: RoomStatementProps) => {
  const pathname = window.location.pathname;
  const roomId = pathname.split("/")[2];
  const { user } = useStoreState((state) => state);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAllStatements = async () => {
      try {
        setLoading(true);
        console.log("Loading statements");
        const { data: listOfUserStatement, error: listOfUserStatementError } =
          await supabase
            .from("statements")
            .select()
            .eq("roomId", roomId)
            .contains("between", [user?.id]);

        if (listOfUserStatementError) {
          throw listOfUserStatementError;
        }

        if (listOfUserStatement.length) {
          const a: Statement[] = [];
          for (let i = 0; i < 32; i++) {
            a.push(listOfUserStatement[0]);
          }
          setStatements(a as Statement[]);
        }

        console.log("Loaded statements", listOfUserStatement.length);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    loadAllStatements();
  }, []);

  useEffect(() => {
    const subscribe = supabase
      .channel(`${roomId} statement`)
      .on("broadcast", { event: "updating-statement" }, ({ payload }) => {
        console.log(" received!", payload);
        setStatements((p) =>
          p.map((s) => ({
            ...s,
            amount: s.id === payload.id ? payload.amount : s.amount,
          }))
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscribe);
    };
  }, []);

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
        maxHeight: "75%",
        // overflow: "auto",
      }}
    >
      <Accordion sx={{ flexGrow: 1 }}>
        <AccordionSummary
          expandIcon={<KeyboardArrowDown />}
          aria-controls="panel1a-content"
        >
          <Typography>Statement</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: 0,
            paddingBottom: 2,
            paddingX: 2,
            height: "60vh",
            overflowY: "scroll",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: -2,
              }}
            >
              <CircularProgress size={16} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {statements.length > 0 ? (
                statements.map((s, index) => {
                  const statementSpecificUser = roomUsers.find(
                    (ru) => s.between.includes(ru.id) && ru.id !== user?.id
                  );
                  if (!statementSpecificUser) {
                    return <Fragment key={index}></Fragment>;
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
                          paddingY: "2px",
                          border: "px solid red",
                          borderRadius: "8px",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: "20px" }}>
                          <Box sx={{}}>
                            <Avatar>
                              {statementSpecificUser.name
                                .charAt(0)
                                .toUpperCase()}
                            </Avatar>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ fontSize: "15px" }}>
                              {statementSpecificUser.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            sx={{ fontSize: "15px", fontWeight: "600" }}
                          >
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
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
export default RoomStatement;
