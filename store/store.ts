import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import languageReducer from "./languageSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    language: languageReducer,
    user: userReducer,
  },
});

// ✅ Infer types automatically
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
