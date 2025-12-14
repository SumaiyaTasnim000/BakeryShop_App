import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: string;
  name: string;
  price: number;
  image?: any;
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
   removeItem: (state, action: PayloadAction<string>) => {
  state.items = state.items.filter((item) => item.id !== action.payload);
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

export const { addToCart, removeItem, clearCartAfterCheckout } =
  cartSlice.actions;

export default cartSlice.reducer;
