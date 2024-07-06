import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { initializeAnecdotes } from './reducers/anecdoteReducer';

import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import AnecdoteFilter from './components/AnecdoteFilter';
import Notification from './components/Notification';

const App = () => {
  const notification = useSelector(state => state.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, []);

  return (
    <div>
      <h2>Anecdotes</h2>
      {notification ? <Notification /> : <AnecdoteFilter />}
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
