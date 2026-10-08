import { createSlice } from '@reduxjs/toolkit';
import { loadJSON } from '../../utils/storage';

// Restore state from localStorage so login survives a refresh
const saved = loadJSON('auth', {});

const initialState = {
  users: saved.users || [],
  currentUser: saved.currentUser || null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register(state, action) {
      const { name, email, password } = action.payload;
      const cleanEmail = email.trim().toLowerCase();
      if (state.users.some((u) => u.email === cleanEmail)) {
        state.error = 'An account with this email already exists.';
        return;
      }
      const user = { id: Date.now().toString(), name: name.trim(), email: cleanEmail, password };
      state.users.push(user);
      state.currentUser = { id: user.id, name: user.name, email: user.email };
      state.error = null;
    },
    login(state, action) {
      const { email, password } = action.payload;
      const user = state.users.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
      );
      if (!user) {
        state.error = 'Invalid email or password.';
        return;
      }
      state.currentUser = { id: user.id, name: user.name, email: user.email };
      state.error = null;
    },
    logout(state) {
      state.currentUser = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;