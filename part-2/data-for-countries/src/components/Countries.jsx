import CountriesList from './CountriesList';
import CountryData from './CountryData';

const Countries = ({ countries }) => {
  const renderCountries = () => {
    if (countries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (countries.length > 1 && countries.length <= 10) {
      return <CountriesList countries={countries} />;
    } else if (countries.length === 1) {
      return <CountryData country={countries[0]} />;
    } else {
      return null;
    }
  };

  return <>{renderCountries()}</>;
};
export default Countries;
