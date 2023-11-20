import { Action } from "easy-peasy";

export interface User {
  id: any;
  name: string;
  email: string;
  password: null;
  username: string;
}

export interface GlobalStore {
  user: User | null;

  setUser: Action<GlobalStore, User>;
}
