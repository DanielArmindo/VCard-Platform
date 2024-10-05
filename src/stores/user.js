import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, clearTokken } from "../assets/api";

export const getUser = createAsyncThunk("user/details", async () => {
  try {
    const response = await api.get("/users/me");
    return response.data.data;
  } catch (error) {
    clearTokken();
    return null;
  }
});

//Initicial when reaload page
const inicialState = await (async () => {
  const tokken = sessionStorage.getItem("tokken");
  if (tokken) {
    api.defaults.headers.common.Authorization = "Bearer " + tokken;
    try {
      const response = await api.get("/users/me");
      return response.data.data;
    } catch (error) {
      //Send toast error here if error
      return null;
    }
  }
  return null;
})();

const userSlice = createSlice({
  name: "user",
  initialState: inicialState,
  reducers: {
    clear: () => null,
  },
  extraReducers: (builder) => {
    builder
      // .addCase(getUser.pending, () => null )
      .addCase(getUser.fulfilled, (state, action) => action.payload);
      // .addCase(getUser.rejected, () => null );
  },
});

export const { clear } = userSlice.actions;

export default userSlice.reducer;
