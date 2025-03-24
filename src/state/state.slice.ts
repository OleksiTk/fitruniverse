// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PositionState {
  latitude: number;
  longitude: number;
}

const initialState: PositionState = {
  latitude: 0,
  longitude: 0,
};

const checkPositionReducer = createSlice({
  name: "checkPosition",
  initialState,
  reducers: {
    pushValueState: (state, action: PayloadAction<PositionState>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const { pushValueState } = checkPositionReducer.actions;

export default checkPositionReducer.reducer;
