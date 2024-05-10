import { useState, useEffect } from 'react';

import Filter from './components/Filter';
import Countries from './components/Countries';

import apiServices from './services/countriesServices';

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredSearch, setFilteredSearch] = useState('');

  const countries = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(filteredSearch.toLowerCase())
  );

  useEffect(() => {
    apiServices.getAllCountries().then(data => setAllCountries(data));
  }, []);

  return (
    <>
      <Filter
        filteredSearch={filteredSearch}
        setFilteredSearch={setFilteredSearch}
      />
      {filteredSearch ? <Countries countries={countries} /> : null}
    </>
  );
};

export default App;
