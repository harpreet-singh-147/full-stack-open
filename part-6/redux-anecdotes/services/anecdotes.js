import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const createNew = async content => {
  const object = { content, votes: 0 };
  const res = await axios.post(baseUrl, object);
  return res.data;
};

const vote = async id => {
  const { data: getAnecdote } = await axios.get(`${baseUrl}/${id}`);

  const votedAnecdote = {
    ...getAnecdote,
    votes: getAnecdote.votes + 1,
  };

  const res = await axios.put(`${baseUrl}/${id}`, votedAnecdote);
  return res.data;
};

export default { getAll, createNew, vote };
