import { action } from "easy-peasy";
import { GlobalStore, User } from "../interfaces";

const globalStore: GlobalStore = {
  user: null,

  setUser: action((state, payload: User) => {
    state.user = payload;
  }),
};

export default globalStore;
