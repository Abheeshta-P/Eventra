import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import eventsSliceReducer from "./features/eventsSlice";

const store = configureStore({
  reducer : {
    auth : authSliceReducer,
    events : eventsSliceReducer
  }
});

export default store;