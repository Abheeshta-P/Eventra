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
      // console.log(action)
      state.eventName = action.payload.eventName;
      state.location = action.payload.location;
      state.date = action.payload.date;
      state.eventType = action.payload.eventType;
      saveToLocalStorage(state);
    },
    addCategoryWithService: (state, action) => {
      const { category, serviceEmail } = action.payload; 
    
      const existingCategoryIndex = state.selectedCategories.findIndex(cat => cat.category === category);
      
      if (existingCategoryIndex > -1) {
        state.selectedCategories[existingCategoryIndex].serviceEmail = serviceEmail;
      } else {
        state.selectedCategories.push({ category, serviceEmail });
      }
    
      saveToLocalStorage(state);
    },    
    removeServiceWithCategory: (state, action) => {
      const { category } = action.payload; 
      state.selectedCategories = state.selectedCategories.filter(
        (cat) => cat.category !== category
      );
      saveToLocalStorage(state);
    },    
    resetEventDetails: (state) => {
      // console.log("reset")
      state.eventName = '';
      state.location = '';
      state.date = '';
      state.eventType = ''; 
      state.selectedCategories = [];
      // remove the whole event progress
      saveToLocalStorage(state);
      removeFromLocalStorage();
    },
  },
});

const saveToLocalStorage = (state) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eventDetails', JSON.stringify(state));
  }
};

const removeFromLocalStorage = () =>{
  if (typeof window !== 'undefined') {
    localStorage.removeItem('eventDetails');
  }
}

export const { setEventDetails, addCategoryWithService, resetEventDetails, removeServiceWithCategory } = eventDetailsSlice.actions;
export default eventDetailsSlice.reducer;
