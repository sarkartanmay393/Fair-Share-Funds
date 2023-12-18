import { action } from "easy-peasy";
import { GlobalStore } from "../interfaces";

const globalStore: GlobalStore = {
  user: null,
  rooms: null,
  appbarTitle: "RoomPay",

  setUser: action((state, payload) => {
    state.user = payload;
  }),
  setAppbarTitle: action((state, payload) => {
    state.appbarTitle = payload;
  }),
  setRooms: action((state, payload) => {
    state.rooms = payload;
  }),
};

export default globalStore;
