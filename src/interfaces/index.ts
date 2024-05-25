import { Action } from "easy-peasy";
import { User } from "@supabase/supabase-js";

export enum TransactionType {
  Pay = "Pay",
  Due = "Due",
}

export interface UserData {
  email: string;
  id: string;
  name: string;
  rooms_id: string[];
  username: string;
}

export interface Statement {
  created_at: string;
  id: string;
  amount: number;
  roomId: string;
  users: string[];
}

export interface Room {
  created_by: string;
  id: string;
  last_updated: string | null;
  master_sheet: null;
  name: string;
  transactions_id: string[];
  users_id: string[];
}

export interface PackagedRoom extends Partial<Room> {}

// Transaction can be used in making History of a room
// also make the balance sheet with user.length transaction objects.
export interface Transaction {
  amount: number;
  approved: boolean | null;
  created_at: string;
  from_user: string;
  id: string;
  room_id: string;
  to_user: string;
  type: "Pay" | "Due";
}

export interface Message {
  created_at: string;
  from_user: string;
  id: string;
  text: string;
  roomId: string;
}

export interface GlobalStore {
  user: User | null;
  userData: UserData | null;
  appbarTitle: string;
  // masterSheet: MasterStatement | null;
  isAdmin: boolean;

  setIsAdmin: Action<GlobalStore, boolean>;
  // setMasterSheet: Action<GlobalStore, MasterStatement | null>;
  setUser: Action<GlobalStore, User | null>;
  setUserData: Action<GlobalStore, UserData | null>;
  setAppbarTitle: Action<GlobalStore, string>;
  resetStore: Action<GlobalStore>;
}
