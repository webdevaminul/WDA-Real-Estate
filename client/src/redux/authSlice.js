import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isGoogle: false,
    loading: false,
    error: null,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    emailLoginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGoogle = false;
    },
    googleLoginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGoogle = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isGoogle = false;
      state.error = action.payload;
    },
    profileUpdateSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    userClearSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.isGoogle = false;
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
});

export const {
  requestStart,
  emailLoginSuccess,
  googleLoginSuccess,
  loginFailure,
  profileUpdateSuccess,
  userClearSuccess,
  requestFailure,
  resetError,
} = authSlice.actions;

export default authSlice.reducer;
