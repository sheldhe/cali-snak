import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.isLoggedIn = true;
    },
    logout: (state, action) => {
      state.username = '';
      state.isLoggedIn = false;
    },
  },
  // extraReducers: builder => {
  //   builder.addCase(PURGE, () => initialState);
  // },
});

export const { login, logout } = userSlice.actions;

export const selectIsLoggedIn = state => state.user.isLoggedIn;

export default userSlice.reducer;
