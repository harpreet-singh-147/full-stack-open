import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { getAnecdotes, updateAnecdote } from './requests';

import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

import { useNotificationDispatch } from './hooks/useNotificationHooks';

const App = () => {
  const notificationDispatch = useNotificationDispatch();
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  });
  // console.log(JSON.parse(JSON.stringify(result)));

  const queryClient = useQueryClient();

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: updatedAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      const updatedAnecdotes = anecdotes.map(anecdote =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      );
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes);
    },
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return (
      <div>anecdote serivce not available due to problems in the server</div>
    );
  }

  const anecdotes = result.data;

  const handleVote = anecdote => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    notificationDispatch({
      type: 'DISPLAY_VOTE_NOTIFICATION',
      payload: `anecdote '${anecdote.content}' voted`,
    });

    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
