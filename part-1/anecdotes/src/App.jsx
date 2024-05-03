import { useState } from 'react';
import Anecdote from './components/Anecdote';
import Button from './components/Button';
import AnecdoteWithMostVotes from './components/AnecdoteWithMostVotes';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(() => {
    const initialVotes = {};
    anecdotes.forEach((_, i) => {
      initialVotes[i] = 0;
    });

    return initialVotes;
  });

  const handleNextAnnecdoteClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVoteClick = annecdoteIndex => {
    setVotes(prev => ({ ...prev, [annecdoteIndex]: prev[annecdoteIndex] + 1 }));
  };

  const displayVotes = () => {
    if (votes[selected] === 0) {
      return 'has 0 votes';
    } else if (votes[selected] === 1) {
      return 'has 1 vote';
    } else {
      return `has ${votes[selected]} votes`;
    }
  };

  const getMostVotedAnecdoteIndex = () => {
    const voteCounts = Object.values(votes);
    const mostVotes = Math.max(...voteCounts);
    return voteCounts.indexOf(mostVotes);
  };

  const mostVotesIndex = getMostVotedAnecdoteIndex();

  return (
    <>
      <Anecdote anecdote={anecdotes[selected]} displayVotes={displayVotes} />
      <div>
        <Button onClick={() => handleVoteClick(selected)} text='vote' />
        <Button onClick={handleNextAnnecdoteClick} text='next annecdote' />
      </div>
      {votes[mostVotesIndex] > 0 ? (
        <AnecdoteWithMostVotes
          anecdote={anecdotes[mostVotesIndex]}
          votes={votes[mostVotesIndex]}
        />
      ) : null}
    </>
  );
};

export default App;
