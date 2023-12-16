import { useEffect, useState } from "react";

import supabase from "./supabase/supabase";
import { Database } from "./supabase/types";
import { useStoreActions, useStoreState } from "../store/typedHooks";

export const useUserSyncronizer = () => {
  const { setUser } = useStoreActions((action) => action);
  const { user } = useStoreState((state) => state);
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
        }
      )
      .subscribe();

    supabase.auth.getSession().then(({ data }) => {
      supabase
        .from("users")
        .select("*")
        .eq("id", data.session?.user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            // alert(error.message);
            setIsLoading(false);
            setSuccess(false);
            return;
          }
          setUser(data as Database["public"]["Tables"]["users"]["Row"]);
          setSuccess(true);
          setIsLoading(false);
        });
    });

    return () => {
      supabase.removeChannel(userChannel);
    };
  }, []);

  return { isLoading, success };
};
