import { createSlice } from "@reduxjs/toolkit";

interface LanguageState {
  language: "en" | "bn";
}

const initialState: LanguageState = {
  language: "en", // default English
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "bn" : "en";
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
