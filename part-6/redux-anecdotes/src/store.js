import { configureStore } from '@reduxjs/toolkit';
import anecdotesReducer from './reducers/anecdoteReducer';
import filterAnecdote from './reducers/anecdoteFilterReducer';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
  reducer: {
    anecdotes: anecdotesReducer,
    filter: filterAnecdote,
    notification: notificationReducer,
  },
});

export default store;
