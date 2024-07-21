import { useState, useEffect } from 'react';
import fetchCountry from '../../services/country';

export const useField = type => {
  const [value, setValue] = useState('');

  const onChange = e => {
    setValue(e.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useCountry = name => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      const getCountry = async () => {
        try {
          const res = await fetchCountry.getCountry(name);
          setCountry(res);
        } catch (e) {
          setCountry(e);
        }
      };

      getCountry();
    }
  }, [name]);

  return country;
};
