import { createContext } from "react";
import { type Session, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseContextType = {
  supabase: SupabaseClient<any, "public", any> | undefined;
  session: Session | null;
};

export const SupabaseContext = createContext<SupabaseContextType>({
  supabase: undefined,
  session: null,
});
