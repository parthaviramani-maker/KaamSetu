import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isLogin: false,
  role: null, // 'employer' | 'worker' | 'agent' | 'admin'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role || null;
      state.isLogin = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isLogin = false;
    },
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload.avatar ?? null;
      }
    },
  },
});

export const { loginSuccess, logout, updateAvatar } = authSlice.actions;

export const selectIsLogin = (state) => state.auth.isLogin;
export const selectUser    = (state) => state.auth.user;
export const selectRole    = (state) => state.auth.role;
export const selectToken   = (state) => state.auth.token;

export default authSlice.reducer;
