import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import registrationsReducer from '../features/registrations/registrationsSlice';
import uiReducer from '../features/ui/uiSlice';
import { saveJSON } from '../utils/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    ui: uiReducer,
  },
});

// Save to localStorage only when these slices actually change
let prevAuth;
let prevRegs;
store.subscribe(() => {
  const { auth, registrations } = store.getState();
  if (auth.users !== prevAuth?.users || auth.currentUser !== prevAuth?.currentUser) {
    saveJSON('auth', { users: auth.users, currentUser: auth.currentUser });
  }
  if (registrations.items !== prevRegs?.items) {
    saveJSON('registrations', registrations.items);
  }
  prevAuth = auth;
  prevRegs = registrations;
});