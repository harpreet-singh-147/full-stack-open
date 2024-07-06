import { createSlice } from '@reduxjs/toolkit';
import anecdotes from '../../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    anecdoteVote(state, action) {
      const votedAnecdote = action.payload;
      return state.map(annecdote =>
        annecdote.id !== votedAnecdote.id ? annecdote : votedAnecdote
      );
    },
    appendAnecdotes(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { addAnecdote, anecdoteVote, setAnecdotes, appendAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const allAnecdotes = await anecdotes.getAll();
    dispatch(setAnecdotes(allAnecdotes));
  };
};

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotes.createNew(content);
    dispatch(appendAnecdotes(newAnecdote));
  };
};

export const voteAnecdote = id => {
  return async disptach => {
    const updateAnecdote = await anecdotes.vote(id);
    disptach(anecdoteVote(updateAnecdote));
  };
};

export default anecdoteSlice.reducer;
