import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    displayNotification(state, action) {
      if (action.payload.type === 'add') {
        return action.payload.content;
      } else if (action.payload.type === 'vote') {
        return action.payload.content;
      }

      return state;
    },
    clearNotification() {
      return initialState;
    },
  },
});

export const { displayNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
