import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [
    {
      "id" : "1",
      "eventName": "John and Jane's Wedding",
      "location": "City Hall",
      "date": "2024-12-25",
      "eventType": "wedding"
    },
    {
      "id" : "2",
      "eventName": "John and Jane's Wedding",
      "location": "City Hall",
      "date": "2024-12-25",
      "eventType": "entertainment"
    },
    {
      "id" : "3",
      "eventName": "John and Jane's Wedding",
      "location": "City Hall",
      "date": "2024-12-25",
      "eventType": "party"
    },
    {
      "id" : "4",
      "eventName": "John and Jane's Wedding",
      "location": "City Hall",
      "date": "2024-12-25",
      "eventType": "wedding"
    },
  ],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload); // Add new event
    },
    removeEvent: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload.id);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload; // Update the event
      }
    }
  }
});

export const { addEvent, removeEvent, updateEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
