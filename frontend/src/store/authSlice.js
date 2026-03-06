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
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const selectIsLogin = (state) => state.auth.isLogin;
export const selectUser   = (state) => state.auth.user;
export const selectRole   = (state) => state.auth.role;

export default authSlice.reducer;
