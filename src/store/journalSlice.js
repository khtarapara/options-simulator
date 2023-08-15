import { createSlice } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = "journal";

const getInitialState = () => {
  const json = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return JSON.parse(json) || [];
  } catch {
    return [];
  }
};

export const journalSlice = createSlice({
  name: "journal",
  initialState: getInitialState(),
  reducers: {
    addTrade: (state, { payload }) => {
      state.unshift(...payload);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    },
    import: (_, { payload }) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      return payload;
    },
    clear: () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      return [];
    },
  },
});

export const journalActions = journalSlice.actions;
