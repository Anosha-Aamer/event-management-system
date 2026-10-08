import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchEvents, getEvent, getSegments } from '../../services/ticketmaster';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params, { rejectWithValue }) => {
  try {
    return await searchEvents(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchEventDetails = createAsyncThunk('events/fetchEventDetails', async (id, { rejectWithValue }) => {
  try {
    return await getEvent(id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchSegments = createAsyncThunk('events/fetchSegments', async (_, { rejectWithValue }) => {
  try {
    return await getSegments();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const FALLBACK_SEGMENTS = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];

const initialState = {
  list: [],
  page: { number: 0, totalPages: 0, totalElements: 0 },
  listStatus: 'idle', // idle | loading | succeeded | failed
  listError: null,
  listRequestId: null,
  selected: null,
  detailStatus: 'idle',
  detailError: null,
  segments: FALLBACK_SEGMENTS,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.listStatus = 'loading';
        state.listError = null;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return; // ignore outdated responses
        state.listStatus = 'succeeded';
        state.list = action.payload.events;
        state.page = action.payload.page;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.listStatus = 'failed';
        state.listError = action.payload || 'Something went wrong.';
        state.list = [];
      })
      .addCase(fetchEventDetails.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.selected = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selected = action.payload;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload || 'Could not load this event.';
      })
      .addCase(fetchSegments.fulfilled, (state, action) => {
        if (action.payload.length) state.segments = action.payload;
      });
  },
});

export default eventsSlice.reducer;