import React from "react";

import { useStoreState, useStoreActions } from "../store/typedHooks";
import { type User } from "../interfaces";

export const useUser = () => {
  // const { user } = useStoreState((state) => state);
  // const { setUser } = useStoreActions((action) => action);
  // const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  // React.useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const resp = await fetch("/api/user", { method: "GET" });
  //       if (resp.status === 400) {
  //         setIsAuthenticated(false);
  //         return;
  //       }
  //       const userData = (await resp.json()) as User;
  //       setUser(userData);
  //       setIsAuthenticated(true);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   fetchUser();
  // }, [user]);
  // return { isAuthenticated, user };
};
