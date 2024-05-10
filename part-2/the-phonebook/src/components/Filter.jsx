const Filter = ({ filteredSearch, setFilteredSearch }) => {
  return (
    <>
      filter shown with{' '}
      <input
        value={filteredSearch}
        onChange={e => setFilteredSearch(e.target.value)}
      />
    </>
  );
};
export default Filter;
