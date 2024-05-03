const Anecdote = ({ anecdote, displayVotes }) => {
  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdote}</p>
      <p>{displayVotes()}</p>
    </>
  );
};
export default Anecdote;
