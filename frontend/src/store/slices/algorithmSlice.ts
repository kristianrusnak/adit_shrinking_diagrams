import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlgorithmSettingsMap {
  [algorithmId: string]: Record<string, any>; // each algorithm has different settings
}

interface AlgorithmState {
  selectedAlgorithm: string; // id of the currently selected alg
  algorithmSettings: AlgorithmSettingsMap; // settings for each algorithm
}

// Slice selectors
export const selectSelectedAlgorithm = (state: any): string =>
  state.algorithmStore.selectedAlgorithm;
export const selectAlgorithmSettingsMap = (state: any) =>
  state.algorithmStore.algorithmSettings;
export const selectCurrentAlgorithmSettings = (state: any) => {
  const selected = state.algorithmStore.selectedAlgorithm;
  return state.algorithmStore.algorithmSettings[selected] || {};
};

// TODO: consider kruskals as well
// we can let the user specify the edge weights from frontend
const initialState: AlgorithmState = {
  selectedAlgorithm: "kruskals",
  algorithmSettings: {},
};

const algorithmSlice = createSlice({
  name: "algorithm",
  initialState,
  reducers: {
    setSelectedAlgorithm: (state, action: PayloadAction<string>) => {
      state.selectedAlgorithm = action.payload;
    },
    setAlgorithmSettings: (
      state,
      action: PayloadAction<{
        algorithmId: string;
        settings: Record<string, any>;
      }>,
    ) => {
      const { algorithmId, settings } = action.payload;
      state.algorithmSettings[algorithmId] = {
        ...state.algorithmSettings[algorithmId],
        ...settings,
      };
    },
  },
});

export const { setSelectedAlgorithm, setAlgorithmSettings } =
  algorithmSlice.actions;
export default algorithmSlice.reducer;
