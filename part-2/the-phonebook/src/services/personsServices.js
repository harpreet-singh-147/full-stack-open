import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => axios.get(baseUrl).then(res => res.data);

const postPerson = person => axios.post(baseUrl, person).then(res => res.data);

const deleteEntry = id => axios.delete(`${baseUrl}/${id}`);

const updateEntry = (id, updatedPerson) =>
  axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data);

export default {
  getAll,
  deleteEntry,
  postPerson,
  updateEntry,
};
