import { Database } from "../utils/supabase/types";

export enum TransactionType {
  Pay = "Pay",
  Due = "Due",
}

type a = Database["public"]["Tables"]["rooms"]["Row"];
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  rooms_id: string[] | null;
  username: string | null;
}

export interface Room {
  created_by: string;
  id: number;
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

export interface GlobalStore {}
