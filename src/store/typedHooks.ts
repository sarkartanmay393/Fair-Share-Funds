import { createTypedHooks } from "easy-peasy";
import { GlobalStore } from "../interfaces";

const typedHooks = createTypedHooks<GlobalStore>();

export const { useStoreState, useStoreActions, useStoreDispatch } = typedHooks;
