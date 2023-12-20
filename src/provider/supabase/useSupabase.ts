import { useContext } from "react";
import { SupabaseContext } from "./context.ts";

export const useSupabaseContext = () => useContext(SupabaseContext);
