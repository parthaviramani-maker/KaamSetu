import { createSlice } from '@reduxjs/toolkit';

const prefersDark = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
  : false;

const themeSlice = createSlice({
  name: 'theme',
  initialState: { isDark: prefersDark },
  reducers: {
    toggleTheme: (state) => { state.isDark = !state.isDark; },
    setDark:     (state) => { state.isDark = true; },
    setLight:    (state) => { state.isDark = false; },
  },
});

export const { toggleTheme, setDark, setLight } = themeSlice.actions;
export const selectIsDark = (state) => state.theme.isDark;
export default themeSlice.reducer;
