import {createSlice,nanoid} from '@reduxjs/toolkit'

const initialState = { participantList: [] };

export const participantSlice = createSlice({
  name: "participantList",
  initialState,
  reducers: {
    addParticipant: (state, action) => {
      const participant = {
        id: action.payload.id,
        sno: action.payload.sno,
        name: action.payload.name,
        phone: action.payload.phone,
        completed: false,
      };
      state.participantList.push(participant);
    },
    deleteParticipant: (state, action) => {
      state.participantList = state.participantList.filter(
        (participant) => participant.id !== action.payload.id
      );
    },
    toggleParticipant: (state, action) => {
      state.participantList = state.participantList.map((participant) =>
        participant.id === action.payload.id
          ? { ...participant, completed: !participant.completed }
          : participant
      );
    },
    setInitialParticipants: (state, action) => {
      state.participantList = action.payload;
    },
    resetParticipants: (state) => {
      state.participantList = []
    }
  },
});

export const {
  addParticipant,
  deleteParticipant,
  toggleParticipant,
  setInitialParticipants,
  resetParticipants
} = participantSlice.actions;

export default participantSlice.reducer;
