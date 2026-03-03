import type { IUser } from '@/interfaces/user/user.interface';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: IUser | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<IUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
