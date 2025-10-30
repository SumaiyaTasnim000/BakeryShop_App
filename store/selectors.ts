import { RootState } from "./store";

export const selectBestSellers = (state: RootState, allItems: any[]) => {
  const counts = state.cart.salesCount || {};

  return allItems
    .map((item) => ({
      ...item,
      ordered: counts[item.id] || 0,
    }))
    .sort((a, b) => b.ordered - a.ordered)
    .slice(0, 3);
};
