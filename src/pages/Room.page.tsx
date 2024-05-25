import { useEffect, useState } from "react";
import { Box, CircularProgress, LinearProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import TransactionInputBar from "../components/Room/TransactionInput.tsx";
import { useStoreActions, useStoreState } from "../store/typedHooks.ts";
import TransactionsHistory from "../components/Room/TransactionsHistory.tsx";
import RoomStatement from "../components/Room/RoomStatement.tsx";
import {
  Message,
  Room,
  Statement,
  Transaction,
  UserData,
} from "@/interfaces/index.ts";
import supabase from "@/utils/supabase/supabase.ts";

export default function RoomPage() {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomUsers, setRoomUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomUserIds, setRoomUserIds] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [masterStatement, setMasterStatement] = useState<Statement[]>([]);

  const { user } = useStoreState((state) => state);
  const { setAppbarTitle, setIsAdmin } = useStoreActions((actions) => actions);

  useEffect(() => {
    const fetchCurrentRoom = async () => {
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

        console.log("Loaded Current Room " + data?.name);
        // const masterSheet = new MasterStatement(data.master_sheet);
        // setCurrentRoom({ ...data, master_sheet: masterSheet });
        setRoomUserIds(data.users_id);
        setIsAdmin(data.created_by === user?.id);
        // const statement = masterSheet.getStatement(user?.id ?? "");
        // setRoomStatement(statement);
        setAppbarTitle(data.name || "Room ~");
        setLoading(false);
      } catch (err) {
        navigate("/");
        setLoading(false);
        console.log(err);
      }
    };

    if (!currentRoom) {
      fetchCurrentRoom();
    }
  }, [id]);

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

    if (roomUserIds.length && !roomUsers.length) {
      console.log("Fetch with " + roomUserIds.length);
      fetchCurrentRoomUsers(roomUserIds);
    }
  }, [roomUserIds]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (currentRoom) {
        console.log("Fetching Transactions...");
        try {
          const { data, error } = await supabase
            .from("transactions")
            .select()
            .in("id", currentRoom.transactions_id)
            .order("created_at", { ascending: false });

          if (error) {
            throw error;
          }
          setTransactions(data as Transaction[]);
          setLoading(false);
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      }
    };

    if (!transactions.length) {
      fetchTransactions();
    }
  }, [currentRoom, transactions.length]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentRoom) {
        console.log("Fetching Messages...");
        try {
          // setLoading(true);
          const { data, error } = await supabase
            .from("messages")
            .select()
            .eq("roomId", currentRoom.id)
            .order("created_at", { ascending: false });

          if (error) {
            throw error;
          }
          setMessages(data as Message[]);
          setLoading(false);
        } catch (e) {
          console.log(e);
          // setLoading(false);
        }
      }
    };

    if (!messages.length) {
      fetchMessages();
    }
  }, [currentRoom, messages.length]);

  useEffect(() => {
    const loadAllStatements = async () => {
      const { data: listOfUserStatement, error: listOfUserStatementError } =
        await supabase
          .from("statements")
          .select()
          .eq("roomId", id)
          .in("between", [user?.id]);

      if (listOfUserStatementError) {
        console.log(listOfUserStatementError.message);
        return;
      }

      if (listOfUserStatement.length) {
        setMasterStatement(listOfUserStatement);
      }
    };

    if (currentRoom) {
      loadAllStatements();
    }
  }, [currentRoom, id, user?.id]);

  useEffect(() => {
    const currentRoomChannel = supabase
      .channel(`room ch ${currentRoom?.id ?? id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms" },
        (payload) => {
          console.log(`UPDATE current room`);
          const nr = payload.new;
          setCurrentRoom({
            ...nr,
          } as Room);
          setRoomUserIds(nr.users_id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "transactions" },
        (payload) => {
          // TODO: only approval update accepting
          console.log(`UPDATE transaction`);
          const updatedTransaction = payload.new as Transaction;
          const updatedTransactions = transactions.map((t) => ({
            ...t,
            approved:
              t.id !== updatedTransaction.id
                ? t.approved
                : updatedTransaction.approved,
          }));
          setTransactions(updatedTransactions);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        (payload) => {
          const t = payload.new as Transaction;
          console.log(`INSERT transaction`, payload);
          setTransactions((p) => [t, ...p]);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const t = payload.new as Message;
          console.log(`INSERT message`, payload);
          setMessages((p) => [t, ...p]);
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
          {loading ? null : (
            <RoomStatement roomUsers={roomUsers} statements={masterStatement} />
          )}
          <TransactionsHistory
            roomUsers={roomUsers}
            transactions={transactions}
            messages={messages}
          />
          <TransactionInputBar roomData={currentRoom} roomUsers={roomUsers} />
        </>
      )}
    </Box>
  );
}
