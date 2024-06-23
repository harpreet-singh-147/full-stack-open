import { addAnnecdote } from '../reducers/anecdoteReducer';
import { useDispatch } from 'react-redux';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    const content = event.target.annecdote.value;
    if (content) {
      event.target.annecdote.value = '';
      dispatch(addAnnecdote(content));
    }
  };
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input name='annecdote' required />
        </div>
        <button>create</button>
      </form>
    </>
  );
};
export default AnecdoteForm;
