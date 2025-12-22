import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config/apiconfig";

/* ===============================
   Types
================================ */

interface BestSeller {
  id: number;
  name: string;
  price: number;
  image: string;
  sold: number;
}

interface BestSellersState {
  items: BestSeller[];
  loading: boolean;
}

/* ===============================
   Async Thunk
================================ */

export const fetchBestSellers = createAsyncThunk<
  BestSeller[] // return type
>("bestSellers/fetch", async () => {
  const res = await axios.get(`${API_BASE_URL}/api/stats/top-products`);

  return res.data;
});

/* ===============================
   Slice
================================ */

const initialState: BestSellersState = {
  items: [],
  loading: false,
};

const bestSellersSlice = createSlice({
  name: "bestSellers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchBestSellers.fulfilled,
        (state, action: PayloadAction<BestSeller[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      );
  },
});

export default bestSellersSlice.reducer;
