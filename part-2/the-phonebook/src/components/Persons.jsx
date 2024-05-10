import personsService from '../services/personsServices';

const Persons = ({ namesToDisplay, setPersons }) => {
  return (
    <ul className='person-list'>
      {namesToDisplay.map(person => (
        <Person
          key={person.id}
          id={person.id}
          name={person.name}
          number={person.number}
          setPersons={setPersons}
        />
      ))}
    </ul>
  );
};
export default Persons;

const Person = ({ id, name, number, setPersons }) => {
  const handleClick = id => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      personsService
        .deleteEntry(id)
        .then(() =>
          setPersons(prevPersons =>
            prevPersons.filter(person => person.id !== id)
          )
        )
        .catch(e => console.log(e.message));
    }
  };

  return (
    <li>
      <span>
        {name} {number}
      </span>
      <button onClick={() => handleClick(id)}>Delete</button>
    </li>
  );
};
