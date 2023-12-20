import { useEffect, useState } from "react";

import supabase from "./supabase/supabase.ts";
import { Database } from "./supabase/types.ts";
import { useStoreActions } from "../store/typedHooks.ts";
import { useSupabaseContext } from "../provider/supabase/useSupabase.ts";
import { User } from "../interfaces/index.ts";

export const useCurrentUser = () => {
  const { session } = useSupabaseContext();
  const { setUser } = useStoreActions((action) => action);

  const [isLoading, setIsLoading] = useState(false);
  const [cUser, setCUser] = useState<User>();
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
          loadUser();
        }
      )
      .subscribe();

    const loadUser = () => {
      if (session) {
        supabase
          .from("users")
          .select()
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              setIsLoading(false);
              setSuccess(false);
              return;
            }
            setUser(data as Database["public"]["Tables"]["users"]["Row"]);
            setCUser(data as Database["public"]["Tables"]["users"]["Row"]);
            setSuccess(true);
          });
      }
      setIsLoading(false);
    };

    loadUser();

    return () => {
      supabase.removeChannel(userChannel);
    };
  }, []);

  return { isLoading, success, cUser };
};
