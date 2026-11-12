import {createSlice,nanoid} from '@reduxjs/toolkit'

const initialState = { participantList: [] };

export const participantSlice = createSlice({
  name: "participantList",
  initialState,
  reducers: {
    addParticipant: (state, action) => {
      const participant = {
        id: action.payload.id || nanoid(),
        sno: action.payload.sno || state.participantList.length + 1,
        name: action.payload.name,
        phone: action.payload.phone || '',
        email: action.payload.email || '',
        completed: action.payload.completed || false,
        rsvpStatus: action.payload.rsvpStatus || 'pending',
        headcount: action.payload.headcount || 1,
        dietary: action.payload.dietary || 'None',
        note: action.payload.note || '',
        inviteSent: action.payload.inviteSent || false,
      };
      state.participantList.push(participant);
    },
    addMultipleParticipants: (state, action) => {
      if (Array.isArray(action.payload)) {
        action.payload.forEach((p) => {
          state.participantList.push({
            id: p.id || nanoid(),
            sno: state.participantList.length + 1,
            name: p.name,
            phone: p.phone || '',
            email: p.email || '',
            completed: p.completed || false,
            rsvpStatus: p.rsvpStatus || 'pending',
            headcount: p.headcount || 1,
            dietary: p.dietary || 'None',
            note: p.note || '',
            inviteSent: p.inviteSent || false,
          });
        });
      }
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
      if (Array.isArray(action.payload)) {
        state.participantList = action.payload.map((p, idx) => {
          const unifiedId = String(p.id || p._id || nanoid());
          return {
            id: unifiedId,
            _id: p._id,
            sno: p.sno || idx + 1,
            name: p.name,
            phone: p.phone || '',
            email: p.email || '',
            completed: Boolean(p.completed),
            rsvpStatus: p.rsvpStatus || 'pending',
            headcount: p.headcount || 1,
            dietary: p.dietary || 'None',
            note: p.note || '',
            inviteSent: Boolean(p.inviteSent),
            inviteSentAt: p.inviteSentAt
          };
        });
      } else {
        state.participantList = [];
      }
    },
    markInvitesSent: (state, action) => {
      const sentEmails = (action.payload?.sentEmails || []).map(e => e.toLowerCase());
      const sentIds = action.payload?.sentIds || [];
      state.participantList = state.participantList.map(p => {
        const matchesEmail = p.email && sentEmails.includes(p.email.toLowerCase());
        const matchesId = (p.id && sentIds.includes(p.id)) || (p._id && sentIds.includes(p._id));
        if (matchesEmail || matchesId) {
          return { ...p, inviteSent: true };
        }
        return p;
      });
    },
    resetParticipants: (state) => {
      state.participantList = []
    }
  },
});

export const {
  addParticipant,
  addMultipleParticipants,
  deleteParticipant,
  toggleParticipant,
  setInitialParticipants,
  markInvitesSent,
  resetParticipants
} = participantSlice.actions;

export default participantSlice.reducer;
