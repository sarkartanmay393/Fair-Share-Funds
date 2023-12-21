import { action } from "easy-peasy";
import { GlobalStore } from "../interfaces/index.ts";

const globalStore: GlobalStore = {
  user: null,
  rooms: null,
  appbarTitle: "RoomPay",
  isAdmin: false,

  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setAppbarTitle: action((state, payload) => {
    state.appbarTitle = payload;
  }),
  setRooms: action((state, payload) => {
    state.rooms = payload;
  }),
  setIsAdmin: action((state, payload) => {
    state.isAdmin = payload;
    // console.log(payload)
  }),
};

export default globalStore;
