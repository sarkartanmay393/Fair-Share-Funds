import { createTypedHooks } from "easy-peasy";
import { GlobalStore } from "../interfaces/index.ts";

const typedHooks = createTypedHooks<GlobalStore>();

export const { useStoreState, useStoreActions, useStoreDispatch } = typedHooks;
