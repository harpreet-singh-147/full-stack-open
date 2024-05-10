import { useState } from 'react';

import Country from './Country';
import CountryData from './CountryData';

import Modal from './Modal';

const CountriesList = ({ countries }) => {
  const [showCountry, setShowCountry] = useState(false);
  const [singleCountry, setSingleCountry] = useState(null);

  const toggleCountry = country => {
    setShowCountry(true);
    setSingleCountry(country);
  };
  return (
    <>
      <ul className='countries-list'>
        {countries.map(country => (
          <Country
            key={country.flags.png}
            country={country}
            showCountry={showCountry}
            toggleCountry={toggleCountry}
          />
        ))}
      </ul>

      {showCountry ? (
        <Modal openModal={showCountry} closeModal={() => setShowCountry(false)}>
          <CountryData country={singleCountry} />
        </Modal>
      ) : null}
    </>
  );
};
export default CountriesList;
