import { ReactNode, useContext, useEffect, useState } from "react";

import { SupabaseContext } from "../supabase/context";
import supabase from "../../utils/supabase/supabase";
import { useLocalStorage } from "../../utils/localstorage";
import { User } from "../../interfaces";

export default function SupabaseContextProvider({ children }: { children: ReactNode }) {
  const localUser = (useLocalStorage())?.user;
  const dummyUser = {
    id: '',
    name: '',
    email: '',
    username: '',
    rooms_id: [],
  } as User;

  const [user, setUser] = useState<User | undefined>(localUser && {
    ...dummyUser,
    id: localUser.id
  });
  const [error, setError] = useState("");

  const initializeUser = async () => {
    const userResponse = await supabase.auth.getUser();
    if (userResponse.error) {
      setError(userResponse.error.message);
      setUser(undefined);
    } else {
      setError('');
      setUser({ ...dummyUser, id: userResponse.data.user.id });
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
