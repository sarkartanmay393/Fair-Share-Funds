import { createContext } from "react";
import { type SupabaseClient, type User } from "@supabase/supabase-js";

type SupabaseContextType = {
  supabase: SupabaseClient<any, "public", any> | undefined;
  user: User | undefined;
};

export const SupabaseContext = createContext<SupabaseContextType>({
  supabase: undefined,
  user: undefined,
});
