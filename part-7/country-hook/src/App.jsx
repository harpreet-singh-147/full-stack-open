import { useState } from 'react';

import SearchCountry from './components/SearchCountry';
import Country from './components/Country';

import { useCountry } from './hooks';

const App = () => {
  const [name, setName] = useState('');
  const country = useCountry(name);

  return (
    <div>
      <SearchCountry setName={setName} />
      <Country country={country} />
    </div>
  );
};

export default App;
