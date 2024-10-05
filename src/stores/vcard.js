import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getVcard as getVcardApi } from "../assets/api";

export const getVcard = createAsyncThunk("vcard/details", async (id) => {
  const response = await getVcardApi(id);
  if (typeof response !== "string") {
    return response;
  } else {
    return null;
  }
});

const vcardSlice = createSlice({
  name: "vcard",
  initialState: null,
  reducers: {
    clear: () => null,
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getUser.pending, () => null )
      .addCase(getVcard.fulfilled, (state, action) => action.payload);
     // .addCase(getUser.rejected, () => null );
  },
});

export const { clear } = vcardSlice.actions;

export default vcardSlice.reducer;
