import { useEffect, useState } from "react";

import supabase from "./supabase/supabase.ts";
import { Database } from "./supabase/types.ts";
import { useStoreActions, useStoreState } from "../store/typedHooks.ts";

export const useRoomSyncronizer = () => {
  const { setRooms } = useStoreActions((action) => action);
  const { user } = useStoreState((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const roomChannel = supabase
      .channel("room_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms" },
        (payload) => {
          console.log(payload);
        }
      )
      .subscribe();

    supabase
      .from("rooms")
      .select("*")
      .in("id", user?.rooms_id || [])
      .then(({ data, error }) => {
        if (error) {
          // alert(error.message);
          setIsLoading(false);
          setSuccess(false);
          return;
        }
        setRooms(data as Database["public"]["Tables"]["rooms"]["Row"][]);
        setSuccess(true);
        setIsLoading(false);
      });

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, []);

  return { isLoading, success };
};
