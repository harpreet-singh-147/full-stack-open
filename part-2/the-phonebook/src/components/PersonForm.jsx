const PersonForm = ({
  handleSubmit,
  newName,
  setNewName,
  number,
  setNumber,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
      </div>
      <div>
        number:{' '}
        <input
          value={number}
          onChange={e => setNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};
export default PersonForm;
