import { ReactNode, useEffect, useState } from "react";

import { SupabaseContext } from "./context.ts";
import supabase from "../../utils/supabase/supabase.ts";
import { type Session } from "@supabase/supabase-js";

export default function SupabaseContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const localSession = localStorage.getItem(
    "sb-jawvorkhuixgggewwkxn-auth-token"
  );
  const [session, setSession] = useState<Session | null>(
    localSession ? JSON.parse(localSession) : null
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event) {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase: supabase, session: session }}>
      {children}
    </SupabaseContext.Provider>
  );
}
