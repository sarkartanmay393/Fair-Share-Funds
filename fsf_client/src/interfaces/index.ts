export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  rooms_id: string[];
}

export interface Room {
  id: string;
  name: string;
  users_id: string[];
  balance_sheet: BalanceSheet;
  transactions: Transaction[];
}

export enum TransactionType {
  Pay = "Pay",
  Due = "Due",
}

// Transaction can be used in making History of a room
// also make the balance sheet with user.length transaction objects.
export interface Transaction {
  id: string;
  from: string; // can use username or email
  to: string; // can use username or email
  time: Date;
  ammount: number;
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
