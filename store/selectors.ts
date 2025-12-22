import { RootState } from "./store";

export const selectBestSellers = (state: RootState) =>
  state.bestSellers.items;
