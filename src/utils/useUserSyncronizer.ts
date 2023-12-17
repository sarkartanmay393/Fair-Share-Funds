import { useEffect, useState } from "react";

import supabase from "./supabase/supabase";
import { Database } from "./supabase/types";
import { useStoreActions } from "../store/typedHooks";
import { useSupabaseContext } from "../provider/supabase/provider";

export const useUserSyncronizer = () => {
  const { session } = useSupabaseContext();
  const { setUser } = useStoreActions((action) => action);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const userChannel = supabase
      .channel("user_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          console.log(payload);
        },
      )
      .subscribe();

    supabase
      .from("users")
      .select("*")
      .eq("id", session?.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          alert(error.message);
          setIsLoading(false);
          setSuccess(false);
          return;
        }
        setUser(data as Database["public"]["Tables"]["users"]["Row"]);
        setSuccess(true);
        setIsLoading(false);
      });

    return () => {
      supabase.removeChannel(userChannel);
    };
  }, []);

  return { isLoading, success };
};
