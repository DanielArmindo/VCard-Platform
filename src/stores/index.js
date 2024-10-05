import { configureStore } from "@reduxjs/toolkit";
import user from "./user";
import vcard from "./vcard";

const store = configureStore({
  reducer: {
    user,
    vcard,
  },
});

export default store;
