import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import TransactionInputBar from "../components/Room/TransactionInput.tsx";
import { useStoreActions, useStoreState } from "../store/typedHooks.ts";
import TransactionsHistory from "../components/Room/TransactionsHistory.tsx";
import RoomStatement from "../components/Room/RoomStatement.tsx";
import { Room, UserData } from "@/interfaces/index.ts";
import supabase from "@/utils/supabase/supabase.ts";

export default function RoomPage() {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomUsers, setRoomUsers] = useState<UserData[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const { user } = useStoreState((state) => state);
  const { setAppbarTitle, setIsAdmin } = useStoreActions((actions) => actions);

  useEffect(() => {
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
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    const fetchCurrentRoom = async (): Promise<string[]> => {
      console.log("Fetching Current Room");
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

        if (!data.users_id.includes(user?.id ?? "")) {
          throw new Error("User don't access to this room");
        }

        console.log("Loaded Current Room " + data?.name);
        setCurrentRoom(data as Room);
        setIsAdmin(data.created_by === user?.id);
        setAppbarTitle(data.name || "Room ~");
        setLoading(false);
        return data.users_id ?? [];
      } catch (err) {
        setLoading(false);
        console.log(err);
        navigate("/");
        return [];
      }
    };

    if (!currentRoom) {
      fetchCurrentRoom().then((roomUserIds) => {
        if (roomUserIds.length) {
          console.log("Fetch with " + roomUserIds.length);
          fetchCurrentRoomUsers(roomUserIds);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    const currentRoomChannel = supabase
      .channel(`room ch ${currentRoom?.id ?? id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms" },
        (payload) => {
          if (payload.new.id === currentRoom?.id) {
            console.log(`UPDATE current room`);
            setCurrentRoom(payload.new as Room);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(currentRoomChannel);
    };
  }, []);

  return (
    <Box
      // ref={trnxContainerRef}
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
      border="px solid yellow"
    >
      {loading ? (
        <Box
          height="100%"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={6}
        >
          <CircularProgress size={16} />
        </Box>
      ) : (
        <>
          <RoomStatement roomUsers={roomUsers} />
          <TransactionsHistory roomUsers={roomUsers} />
          {currentRoom && roomUsers.length > 1 ? (
            <TransactionInputBar roomData={currentRoom} roomUsers={roomUsers} />
          ) : (
            <></>
          )}
        </>
      )}
    </Box>
  );
}
