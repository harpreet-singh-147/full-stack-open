import { useSelector } from 'react-redux';

import { addAnecdote } from '../reducers/anecdoteReducer';
import {
  displayNotification,
  clearNotification,
} from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';

const AnecdoteForm = () => {
  const notification = useSelector(state => state.notification);

  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    e.target.anecdote.value = '';
    dispatch(addAnecdote(content));
    dispatch(displayNotification({ type: 'add', content: `${content} added` }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name='anecdote' required />
        </div>
        <button disabled={notification}>create</button>
      </form>
    </>
  );
};
export default AnecdoteForm;
