import { configureStore } from "@reduxjs/toolkit";
import { journalSlice } from "./journalSlice";

const store = configureStore({
  reducer: {
    journal: journalSlice.reducer,
  },
});

export default store;
