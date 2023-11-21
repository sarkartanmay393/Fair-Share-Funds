import { Action } from "easy-peasy";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  rooms: string[];
  balance_sheet: {};
}

export interface GlobalStore {
  user: User | null;

  setUser: Action<GlobalStore, User>;
}
