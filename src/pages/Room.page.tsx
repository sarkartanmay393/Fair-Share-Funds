import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
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
    <Grid
      container
      px={4}
      pt="64px"
      pb="135px"
      height="100%"
      justifyContent="center"
      sx={{ overflowY: "scroll" }}
    >
      <MasterStatement POVstatement={userPOVstatement} roomUsers={roomUsers} />
      <TransactionsHistory
        transactions={currentTransactions}
        roomUsers={roomUsers}
        currentRoomData={currentRoomData}
      />
      <InputBar roomData={currentRoomData} roomUsers={roomUsers} />
    </Grid>
  );
}
