import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import eventsSliceReducer from "./features/eventsSlice";
import participantListSliceReducer  from "./features/participantSlice";
import todoListSliceReducer  from "./features/todoSlice";

const store = configureStore({
  reducer : {
    auth : authSliceReducer,
    events : eventsSliceReducer,
    participantsList : participantListSliceReducer,
    todoList : todoListSliceReducer
  }
});

export default store;