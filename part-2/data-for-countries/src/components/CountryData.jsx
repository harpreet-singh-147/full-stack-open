import { useEffect, useState } from 'react';

import apiServices from '../services/countriesServices';

const CountryData = ({ country }) => {
  const [capitalWeather, setCapitalWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    apiServices
      .getWeather(country.capital[0])
      .then(data => setCapitalWeather(data))
      .catch(e => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [country.capital]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Sorry there was an error</p>
      ) : (
        <article className='country-data'>
          <h2>{country.name.common}</h2>
          <p>capital {country.capital[0]}</p>
          <p>area {country.area}</p>

          <h3>languages:</h3>
          <ul>
            {Object.values(country.languages).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={country.flags.alt} />
          {capitalWeather ? (
            <CapitalWeatherData capitalWeather={capitalWeather} />
          ) : null}
        </article>
      )}
    </>
  );
};
export default CountryData;

const CapitalWeatherData = ({ capitalWeather }) => {
  return (
    <>
      <h2>Weather in {capitalWeather.name} </h2>
      <p>temperature {capitalWeather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${capitalWeather.weather[0].icon}@2x.png`}
        alt={`Icon representing current weather status: ${capitalWeather.weather[0].description}`}
      />
      <p>wind {capitalWeather.wind.speed} m/s</p>
    </>
  );
};
