import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    clearCartAfterCheckout: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCartAfterCheckout,
} = cartSlice.actions;

export default cartSlice.reducer;
