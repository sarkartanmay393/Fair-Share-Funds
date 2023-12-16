import { ReactNode, useContext, useEffect, useState } from "react";

import { SupabaseContext } from "../supabase/context";
import supabase from "../../utils/supabase/supabase";
import { type Session } from "@supabase/supabase-js";


export default function SupabaseContextProvider({ children }: { children: ReactNode }) {
  const localSession = localStorage.getItem('sb-jawvorkhuixgggewwkxn-auth-token');
  const [session, setSession] = useState<Session | null>(localSession ? JSON.parse(localSession) : null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase: supabase, session: session }}>
      {children}
    </SupabaseContext.Provider >
  );
}

export const useSupabaseContext = () => useContext(SupabaseContext);
