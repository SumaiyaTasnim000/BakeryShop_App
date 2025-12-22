import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import bestSellersReducer from "./bestSellersSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    bestSellers: bestSellersReducer,
  },
});

// ✅ THESE TWO LINES ARE REQUIRED
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
