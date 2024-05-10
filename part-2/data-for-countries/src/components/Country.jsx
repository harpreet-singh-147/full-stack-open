const Country = ({ country, showCountry, toggleCountry }) => {
  const handleClick = () => {
    toggleCountry(country);
  };

  return (
    <>
      <li>
        <p>{country.name.common}</p>
        {!showCountry ? <button onClick={handleClick}>show</button> : null}
      </li>
    </>
  );
};
export default Country;
