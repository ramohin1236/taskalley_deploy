import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    reset(state) {
      state.value = 0;
    },
    setValue(state, action) {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, reset, setValue } = countSlice.actions;
export default countSlice.reducer;

