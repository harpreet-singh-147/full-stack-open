const AnecdoteWithMostVotes = ({ anecdote, votes }) => {
  return (
    <>
      <h2>Anecdote with most votes</h2>
      <p>{anecdote}</p>
      <p>
        has {votes} {votes === 1 ? 'vote' : 'votes'}
      </p>
    </>
  );
};

export default AnecdoteWithMostVotes;
