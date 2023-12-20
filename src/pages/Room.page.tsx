import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import InputBar from "../components/Room/Input.tsx";
import { Database } from "../utils/supabase/types.ts";
import { useStoreActions } from "../store/typedHooks.ts";
import { useSupabaseContext } from "../provider/supabase/useSupabase.ts";
import TransactionsHistory from "../components/Room/TransactionsHistory.tsx";
import { useCurrentRoomData } from "../utils/useCurrentRoomData.ts";
import RoomStatement from "../components/Room/RoomStatement.tsx";

export default function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const trnxContainerRef = useRef<HTMLDivElement | null>(null);
  const { supabase, session } = useSupabaseContext();
  const { setAppbarTitle } = useStoreActions((actions) => actions);
  const [roomUsers, setRoomUsers] =
    useState<Database["public"]["Tables"]["users"]["Row"][]>();

  const { currentRoomData } = useCurrentRoomData(id || "");

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
    } catch (e) {
      null;
    }
  };

  useEffect(() => {
    if (currentRoomData) {
      setAppbarTitle(currentRoomData.name || "Room ~");
    }

    fetch();
    return () => {
      setAppbarTitle("Roompay");
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
    >
      <RoomStatement
        statement={currentRoomData?.master_sheet.getStatement(
          session?.user.id || ""
        )}
        roomUsers={roomUsers}
      />
      <TransactionsHistory roomUsers={roomUsers} roomId={id!} />
      <InputBar roomData={currentRoomData} roomUsers={roomUsers} />
    </Box>
  );
}
