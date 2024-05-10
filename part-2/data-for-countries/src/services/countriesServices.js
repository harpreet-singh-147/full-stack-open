import axios from 'axios';

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const baseWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const getAllCountries = () => axios.get(baseUrl).then(res => res.data);

const getWeather = capital =>
  axios
    .get(`${baseWeatherUrl}?q=${capital}&appid=${API_KEY}&units=metric`)
    .then(res => res.data);

export default { getAllCountries, getWeather };
