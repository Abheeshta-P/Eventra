import { createSlice } from '@reduxjs/toolkit';

const loadInitialState = () => {
  if (typeof window !== 'undefined') {
    const savedState = localStorage.getItem('eventDetails');
    return savedState ? JSON.parse(savedState) : { eventName: '', location: '', date: '', eventType:'', selectedCategories: [] };
  }
  return { eventName: '', location: '', date: '', eventType:'', selectedCategories: [] }; 
};

const eventDetailsSlice = createSlice({
  name: 'eventDetails',
  initialState: loadInitialState(),
  reducers: {
    setEventDetails: (state, action) => {
      console.log(action)
      state.eventName = action.payload.name;
      state.location = action.payload.location;
      state.date = action.payload.date;
      state.eventType = action.payload.eventType;
      saveToLocalStorage(state);
    },
    addCategoryWithService: (state, action) => {
      const { category, service } = action.payload;
      // Check if the category already exists
      const existingCategoryIndex = state.selectedCategories.findIndex(cat => cat.category === category);
      if (existingCategoryIndex > -1) {
        state.selectedCategories[existingCategoryIndex].services.push(service);
      } else {
        state.selectedCategories.push({ category, services: [service] });
      }
      saveToLocalStorage(state);
    },
    resetEventDetails: (state) => {
      state.eventName = '';
      state.location = '';
      state.date = '';
      state.eventType = ''; 
      state.selectedCategories = [];
      saveToLocalStorage(state);
    },
  },
});

const saveToLocalStorage = (state) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eventDetails', JSON.stringify(state));
  }
};

export const { setEventDetails, addCategoryWithService, resetEventDetails } = eventDetailsSlice.actions;
export default eventDetailsSlice.reducer;
