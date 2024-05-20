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
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomStatement, setRoomStatement] = useState<Statement>();

  const { user } = useStoreState((state) => state);
  const { setAppbarTitle } = useStoreActions((actions) => actions);

  useEffect(() => {
    const fetchCurrentRoom = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("rooms")
          .select()
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        const cRoom: Room = {
          created_by: data.created_by,
          id: data.id,
          last_updated: data.last_updated,
          master_sheet: new MasterStatement(data.master_sheet),
          name: data.name,
          transactions_id: data.tratransactions_id,
          users_id: data.users_id,
        };

        setCurrentRoom(cRoom);
        // setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    fetchCurrentRoom();
  }, [id]);

  useEffect(() => {
    const fetchCurrentRoomUsers = async (usersId: string[]) => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .in("id", [usersId]);

        if (error) {
          throw error;
        }

        setRoomUsers(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    if (currentRoom) {
      setAppbarTitle(currentRoom.name || "Room ~");
      fetchCurrentRoomUsers(currentRoom.users_id);
    }

    return () => {
      setAppbarTitle("Roompay");
    };
  }, [currentRoom]);

  useEffect(() => {
    if (currentRoom) {
      setTimeout(() => {
        console.log("parsin");
        try {
          const statement = currentRoom.master_sheet.getStatement(
            user?.id ?? ""
          );
          setRoomStatement(statement);
        } catch (error) {
          console.log(error);
        }
      }, 400);
    }
  }, [currentRoom, user?.id]);

  if (!currentRoom) {
    return null;
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
          <TransactionsHistory
            roomUsers={roomUsers}
            roomData={currentRoom}
            roomId={id}
          />
        </>
      )}
      <InputBar roomData={currentRoom} roomUsers={roomUsers} />
    </Box>
  );
}
