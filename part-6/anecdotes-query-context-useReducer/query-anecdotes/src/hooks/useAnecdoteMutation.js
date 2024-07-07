import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationDispatch } from './useNotificationHooks';
import { createAnecdote } from '../requests';

const useAnecdoteMutation = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  return useMutation({
    mutationFn: createAnecdote,
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote]);
    },
    onError: e => {
      notificationDispatch({
        type: 'DISPLAY_ERROR_NOTIFICATION',
        payload: e.response?.data?.error || 'An error occurred',
      });

      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });
};

export default useAnecdoteMutation;
