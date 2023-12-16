// import { Database } from "../utils/supabase/types";

import { Action } from "easy-peasy";

export enum TransactionType {
  Pay = "Pay",
  Due = "Due",
}

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  rooms_id: string[] | null;
  username: string | null;
}

export interface Room {
  created_by: string;
  id: string;
  last_updated: string;
  master_sheet: string;
  name: string | null;
  slug: string;
  transactions_id: number[];
  users_id: string[];
}

// Transaction can be used in making History of a room
// also make the balance sheet with user.length transaction objects.
export interface Transaction {
  id: string;
  from: string; // can use username or email
  to: string; // can use username or email
  time: Date;
  amount: number;
  type: TransactionType;
  room_id: string;
  sheet_id?: string; // if not exists, we know its normal transaction on history
}

export interface BalanceSheet {
  id: string;
  room_id: string;
  users_count: number;
  sheet: Transaction[]; // transaction.length==users_count
}

export interface GlobalStore {
  user: User | null;
  appbarTitle: string;
  rooms: Room[] | null;

  setUser: Action<GlobalStore, User | null>;
  setAppbarTitle: Action<GlobalStore, string>;
  setRooms: Action<GlobalStore, Room[] | null>;
}
