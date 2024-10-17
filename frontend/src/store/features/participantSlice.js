import {createSlice,nanoid} from '@reduxjs/toolkit'

const loadInitialState = (apiCallParticipants) => {
  if (apiCallParticipants) {
    localStorage.setItem('participants', JSON.stringify(apiCallParticipants));
    return { participantList: apiCallParticipants };
  } else {
    // Get the item from localStorage
    const storedParticipants = localStorage.getItem('participants');

    // Parse it if it's not null or an empty string
    const participantsFromLocalStorage = storedParticipants ? JSON.parse(storedParticipants) : [];
    
    return { participantList: participantsFromLocalStorage };
  }
};

const initialState = loadInitialState();

export const participantSlice = createSlice({
  name : "participantList",
  initialState,
  reducers: {
    addParticipant: (state, action) => {
      const participant = {
        id: nanoid(),
        sno : action.payload.sno,
        name: action.payload.name,
        phone : action.payload.phone,
        completed: false,
      };
      state.participantList.push(participant); 
    },

    deleteParticipant: (state, action) => {
      state.participantList = state.participantList.filter((participant) => participant.id !== action.payload.id);
    },

    // updateParticipant: (state, action) => {
    //   state.participantList = state.participantList.map(participant => (participant.id===action.payload.id)?{...participant,name: action.payload.name,phone : action.payload.phone,}:participant);
    // },

    toggleParticipant: (state, action) => {
      state.participantList = state.participantList.map(participant => (participant.id===action.payload.id)?{...participant,completed:!participant.completed}:participant);
    },

  },
})

export const {addParticipant,deleteParticipant,toggleParticipant} = participantSlice.actions;
export default participantSlice.reducer;