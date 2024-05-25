import { action } from "easy-peasy";
import { GlobalStore } from "../interfaces/index.ts";

const globalStore: GlobalStore = {
  user: null,
  userData: null,
  // masterSheet: null,
  appbarTitle: "RoomPay",
  isAdmin: false,

  // setMasterSheet: action((state, payload) => {
  //   state.masterSheet = payload;
  // }),
  setUser: action((state, payload) => {
    state.user = payload;
    // console.log("state", state.user);
  }),
  setUserData: action((state, payload) => {
    state.userData = payload;
  }),
  setAppbarTitle: action((state, payload) => {
    state.appbarTitle = payload;
  }),
  setIsAdmin: action((state, payload) => {
    state.isAdmin = payload;
    // console.log(payload)
  }),
  resetStore: action((state) => {
    state.user = null;
    state.userData = null;
    state.isAdmin = false;
    state.appbarTitle = "RoomPay";
    // state.masterSheet = null;
  }),
};

export default globalStore;
