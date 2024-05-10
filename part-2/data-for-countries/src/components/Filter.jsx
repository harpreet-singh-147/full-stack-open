const Filter = ({ filteredSearch, setFilteredSearch }) => {
  return (
    <>
      find countries{' '}
      <input
        value={filteredSearch}
        onChange={e => setFilteredSearch(e.target.value)}
      />
    </>
  );
};
export default Filter;
