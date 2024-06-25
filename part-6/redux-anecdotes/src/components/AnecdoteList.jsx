import { useMemo } from 'react';
import { annecdoteVote } from '../reducers/anecdoteReducer';
import { useSelector, useDispatch } from 'react-redux';

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes);
  const dispatch = useDispatch();

  const sortedAnecdotes = useMemo(() => {
    return [...anecdotes].sort((a, b) => b.votes - a.votes);
  }, [anecdotes]);

  const vote = id => {
    dispatch(annecdoteVote(id));
  };

  return (
    <>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};
export default AnecdoteList;
