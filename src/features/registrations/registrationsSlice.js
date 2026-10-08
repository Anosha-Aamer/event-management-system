import { createSlice } from '@reduxjs/toolkit';
import { loadJSON } from '../../utils/storage';

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { items: loadJSON('registrations', []) },
  reducers: {
    registerForEvent(state, action) {
      const { userId, event } = action.payload;
      const duplicate = state.items.some((r) => r.userId === userId && r.event.id === event.id);
      if (duplicate) return; // prevents duplicate registration
      state.items.push({ userId, event, registeredAt: new Date().toISOString() });
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload;
      state.items = state.items.filter((r) => !(r.userId === userId && r.event.id === eventId));
    },
  },
});

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions;
export default registrationsSlice.reducer;