// import { useEffect, useState } from "react";

// import supabase from "./supabase/supabase.ts";
// import { useStoreActions, useStoreState } from "../store/typedHooks.ts";

// export const useUserActions = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const { user } = useStoreState((state) => state);
//   const { setUser, setUserData } = useStoreActions((action) => action);

//   const loadAuthenticatedUser = async () => {
//     console.log('Auth Loading')
//     try {
//       setIsLoading(true);
//       const { data, error } = await supabase.auth.getUser();
//       if (error) {
//         throw error;
//       }
//       if (data.user) {
//         setUser(data.user);
//       } else {
//         setUser(data.user);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.log("Error loading current authenticated user");
//       setIsLoading(false);
//     }
//   };

//   const loadCurrentUserData = async () => {
//     console.log("User Data Loading");
//     if (user) {
//       setIsLoading(true);
//       try {
//         // console.log("user", user);
//         const { data, error } = await supabase
//           .from("users")
//           .select()
//           .eq("id", user.id)
//           .single();
//         // console.log("data", data);

//         if (error) {
//           throw error;
//         }
//         setUserData(data);
//         setIsLoading(false);
//       } catch (error) {
//         console.log("Error loading current user data");
//         setIsLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       // console.log(/"Hooks auto fetching auth user, user data");
//       // loadAuthenticatedUser().then(() => {
//       //   console.log("Auth Loaded");
//       // });
//     }
//   }, []);

//   return { isLoading, loadCurrentUserData, loadAuthenticatedUser };
// };
