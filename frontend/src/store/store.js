import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import eventsSliceReducer from "./features/eventsSlice";
import participantListSliceReducer  from "./features/participantSlice";

const store = configureStore({
  reducer : {
    auth : authSliceReducer,
    events : eventsSliceReducer,
    participantsList : participantListSliceReducer
  }
});

export default store;