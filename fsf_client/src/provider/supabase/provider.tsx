import { ReactNode, useContext, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";

import { SupabaseContext } from "../supabase/context";
import supabase from "../../utils/supabase";
import { useLocalStorage } from "../../utils/localstorage";

export default function SupabaseContextProvider({ children }: { children: ReactNode }) {
  const localUser = (useLocalStorage())?.user;

  const [user, setUser] = useState<User | undefined>(localUser);
  const [error, setError] = useState("");

  const initializeUser = async () => {
    const userResponse = await supabase.auth.getUser();
    if (userResponse.error) {
      setError(userResponse.error.message);
      setUser(undefined);
    } else {
      setError('');
      setUser(userResponse.data.user);
    }
  };

  useEffect(() => {
    initializeUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        initializeUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);



  return (
    <SupabaseContext.Provider value={{ supabase: supabase, user: user }}>
      {children}
    </SupabaseContext.Provider >
  );
}

export const useSupabaseContext = () => useContext(SupabaseContext);
