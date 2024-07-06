import { useMemo } from 'react';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';
import { useSelector, useDispatch } from 'react-redux';

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes;
    }

    return state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    );
  });
  const notification = useSelector(state => state.notification);

  const dispatch = useDispatch();

  const sortedAnecdotes = useMemo(() => {
    return [...anecdotes].sort((a, b) => b.votes - a.votes);
  }, [anecdotes]);

  const vote = (id, content) => {
    dispatch(voteAnecdote(id));
    dispatch(setNotification(`you voted '${content}'`, 3));
  };

  return (
    <>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => vote(anecdote.id, anecdote.content)}
              disabled={notification}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
