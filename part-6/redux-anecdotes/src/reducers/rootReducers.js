import { combineReducers } from 'redux';
import anecdotesReducer from './anecdoteReducer';

const rootReducer = combineReducers({
  anecdotes: anecdotesReducer,
});

export default rootReducer;
