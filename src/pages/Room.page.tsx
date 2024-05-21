import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

import InputBar from "../components/Room/Input.tsx";
import { useStoreActions, useStoreState } from "../store/typedHooks.ts";
import TransactionsHistory from "../components/Room/TransactionsHistory.tsx";
import RoomStatement from "../components/Room/RoomStatement.tsx";
import { Room, UserData } from "@/interfaces/index.ts";
import supabase from "@/utils/supabase/supabase.ts";
import { MasterStatement, Statement } from "@/utils/masterSheet.ts";

export default function RoomPage() {
  const { id } = useParams() as { id: string };
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomUsers, setRoomUsers] = useState<UserData[]>([]);
  const [roomUserIds, setRoomUserIds] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomStatement, setRoomStatement] = useState<Statement | null>(null);

  const { user, rooms } = useStoreState((state) => state);
  const { setAppbarTitle, setIsAdmin } = useStoreActions((actions) => actions);

  const fetchCurrentRoomUsers = async (usersId: string[]) => {
    console.log("Fetch Room Users: " + usersId.length);
    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .in("id", usersId);

      if (error) {
        console.log(error.message);
      }

      console.log("Loaded Room Users: " + data?.length);

      setRoomUsers((data as UserData[]) ?? []);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const cr = rooms.find((room) => (room.id = id));
    if (cr && user) {
      setCurrentRoom(cr);
      setRoomUserIds(cr.users_id);

      setIsAdmin(cr.created_by === user.id);

      const statement = cr.master_sheet.getStatement(user.id);
      setRoomStatement(statement);

      setAppbarTitle(cr.name || "Room ~");
    }
  }, [id]);

  useEffect(() => {
    const currentRoomChannel = supabase
      .channel(`room ch ${currentRoom?.id ?? id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "transactions" },
        (payload) => {
          console.log(`UPDATE current room`);
          const nr = payload.new;
          setCurrentRoom({
            ...nr,
            master_sheet: new MasterStatement(nr.master_sheet),
          } as Room);
          setRoomUserIds(nr.users_id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(currentRoomChannel);
    };
  }, []);

  useEffect(() => {
    console.log("Fetch with " + roomUserIds.length);
    fetchCurrentRoomUsers(roomUserIds);
  }, []);

  if (!currentRoom) {
    return <CircularProgress />;
  }

  return (
    <Box
      // ref={trnxContainerRef}
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {loading ? (
        <Box display="flex" width="100%" justifyContent="center" marginTop={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <RoomStatement statement={roomStatement} roomUsers={roomUsers} />
          <TransactionsHistory roomUsers={roomUsers} roomData={currentRoom} />
        </>
      )}
      <InputBar roomData={currentRoom} roomUsers={roomUsers} />
    </Box>
  );
}
