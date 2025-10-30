import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: string;
  name: string;
  price: number;
}

interface CartState {
  items: Item[];
  salesCount: Record<string, number>;
}

const initialState: CartState = {
  items: [],
  salesCount: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ When adding to cart
    addToCart: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },

    // ✅ Remove a single item (optional)
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    // ✅ Checkout logic
    clearCartAfterCheckout: (state) => {
      // Increase sales count for each item purchased
      state.items.forEach((item) => {
        state.salesCount[item.id] = (state.salesCount[item.id] || 0) + 1;
      });

      // Empty the cart after checkout
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCartAfterCheckout } =
  cartSlice.actions;

export default cartSlice.reducer;
