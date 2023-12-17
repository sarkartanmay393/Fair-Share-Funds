import { useEffect, useState } from "react";

import supabase from "./supabase/supabase";
import { Database } from "./supabase/types";
import { Room, Transaction } from "../interfaces";

export const useCurrentRoomData = (roomId: string) => {
  const [currentRoomData, setCurrentRoomData] = useState<Room>();
  const [currentTransactions, setCurrentTransactions] =
    useState<Transaction[]>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    const roomChannel = supabase
      .channel("room_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        (payload) => {
          console.log(payload);
          loadLatestData();
        },
      )
      .subscribe();

    const loadLatestData = () =>
      void supabase
        .from("rooms")
        .select()
        .eq("id", roomId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            setIsLoading(false);
            setError(true);
            return;
          }
          setCurrentRoomData(
            data as Database["public"]["Tables"]["rooms"]["Row"],
          );

          supabase
            .from("transactions")
            .select()
            .in("id", data.transactions_id || [])
            .then(({ data, error }) => {
              if (error) {
                setIsLoading(false);
                setError(true);
                return;
              }
              setCurrentTransactions(
                data as Database["public"]["Tables"]["transactions"]["Row"][],
              );
              setError(false);
              setIsLoading(false);
            });
        });

    loadLatestData();

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, []);

  return { isLoading, error, currentRoomData, currentTransactions };
};
