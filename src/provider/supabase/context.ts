import { createContext } from "react";
import { type SupabaseClient } from "@supabase/supabase-js";
import { User } from "../../interfaces";

type SupabaseContextType = {
  supabase: SupabaseClient<any, "public", any> | undefined;
  user: User | undefined;
};

export const SupabaseContext = createContext<SupabaseContextType>({
  supabase: undefined,
  user: undefined,
});
