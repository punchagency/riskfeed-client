/**
 * Slice Template
 * 
 * Copy this template when creating new slices
 * Replace 'template' with your slice name
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define your state interface
interface TemplateState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: TemplateState = {
  data: null,
  loading: false,
  error: null,
};

// Create slice
const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    // Set data
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      state.error = null;
    },
    
    // Update data partially
    updateData: (state, action: PayloadAction<Partial<any>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear all data
    clearData: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const { setData, updateData, setLoading, setError, clearData } = templateSlice.actions;

// Export reducer
export default templateSlice.reducer;
