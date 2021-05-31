import { createSlice } from "@reduxjs/toolkit";

const thoughts = createSlice({
  name: "thoughts",
  initialState: {
    items: [],
  },
  reducers: {
    setThoughts: (store, action) => {
      store.items = action.payload;
    },
  },
});

export default thoughts;
