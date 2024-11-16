import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  loading: false, 
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
      state.loading = false; // Stop loading when events are set
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setEvents, setLoading } = eventsSlice.actions;
export default eventsSlice.reducer;

  // addEvent: (state, action) => {
    //   state.events.push(action.payload); // Add new event
    // },
    // removeEvent: (state, action) => {
    //   state.events = state.events.filter(event => event.id !== action.payload.id);
    // },
    // updateEvent: (state, action) => {
    //   const index = state.events.findIndex(event => event.id === action.payload.id);
    //   if (index !== -1) {
    //     state.events[index] = action.payload; // Update the event
    //   }
    // }
