import { useSelector } from 'react-redux';

import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';

const AnecdoteForm = () => {
  const notification = useSelector(state => state.notification);

  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    e.target.anecdote.value = '';
    dispatch(createAnecdote(content));
    dispatch(setNotification(`${content} added`, 3));
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
