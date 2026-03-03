import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string | null; refreshToken?: string | null }>
    ) => {
      const { token, refreshToken } = action.payload;

      state.isAuthenticated = Boolean(token);
      state.token = token ?? null;
      state.refreshToken = refreshToken ?? null;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
