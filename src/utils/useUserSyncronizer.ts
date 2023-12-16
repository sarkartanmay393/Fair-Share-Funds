import { useEffect, useState } from "react";

import supabase from "./supabase/supabase";
import { Database } from "./supabase/types";
import { useStoreActions } from "../store/typedHooks";
import { Session } from "@supabase/supabase-js";

export const useUserSyncronizer = () => {
  const { setUser } = useStoreActions((action) => action);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const supaUser = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", supaUser.data.user?.id)
          .single();
        if (error) {
          setIsLoading(false);
          setSuccess(false);
          return;
        }
        // console.log(data);
        setUser(data as Database["public"]["Tables"]["users"]["Row"]);
        setSuccess(true);
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setSuccess(false);
      }
    };

    fetchUserDetails();
  }, []);

  return { isLoading, success };
};
