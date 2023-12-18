import { useEffect, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import InputBar from "../components/Room/Input";
import { Database } from "../utils/supabase/types";
import { useStoreActions } from "../store/typedHooks";
import { useSupabaseContext } from "../provider/supabase/provider";
import TransactionsHistory from "../components/Room/TransactionsHistory";
import { useCurrentRoomData } from "../utils/useCurrentRoomData";
import MasterStatement from "../components/Room/MasterStatement";
import { MasterSheet } from "../interfaces";

export default function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trnxContainerRef = useRef<HTMLDivElement | null>(null);
  const { supabase, session } = useSupabaseContext();
  const { setAppbarTitle } = useStoreActions((actions) => actions);
  const [roomUsers, setRoomUsers] =
    useState<Database["public"]["Tables"]["users"]["Row"][]>();

  const { currentRoomData, currentTransactions } = useCurrentRoomData(id || "");
  const masterStatement = currentRoomData?.master_sheet as MasterSheet;
  const userPOVstatement =
    masterStatement && masterStatement[session?.user.id || ""];

  const fetch = async () => {
    try {
      const usersResp = await supabase
        ?.from("users")
        .select()
        .in("id", currentRoomData?.users_id || []);
      const users =
        usersResp?.data as Database["public"]["Tables"]["users"]["Row"][];
      if (usersResp?.error) {
        navigate("/");
        return;
      }
      if (users) {
        setRoomUsers(users);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (currentRoomData) {
      setAppbarTitle(currentRoomData.name || "FSF Room");
    }

    fetch();
    return () => {
      setAppbarTitle("Fair Share Funds");
    };
  }, [currentRoomData]);

  return (
    <Box
      // ref={trnxContainerRef}
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      // justifyContent="end"
      // px={4}
      // pt="64px"
      // pb="135px"
      // sx={{ overflowY: "scroll" }}
    >
      <MasterStatement POVstatement={userPOVstatement} roomUsers={roomUsers} />
      <TransactionsHistory roomUsers={roomUsers} roomId={id!} />
      <InputBar roomData={currentRoomData} roomUsers={roomUsers} />
    </Box>
  );
}
