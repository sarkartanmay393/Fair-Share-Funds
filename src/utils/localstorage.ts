import { type Session } from "@supabase/supabase-js";

export const useLocalStorage = (): Session | null => {
  const localSession = localStorage.getItem(
    "sb-jawvorkhuixgggewwkxn-auth-token",
  );
  if (localSession) {
    return JSON.parse(localSession);
  }

  return null;
};
