import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  role: "admin" | "customer" | null;
}

const initialState: UserState = {
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<"admin" | "customer">) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, logout } = userSlice.actions;
export default userSlice.reducer;
