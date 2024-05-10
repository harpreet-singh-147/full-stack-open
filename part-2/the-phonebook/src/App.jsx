import { useState, useEffect } from 'react';

import personsService from './services/personsServices.js';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

import Notification from './components/Notification.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [number, setNumber] = useState('');
  const [filteredSearch, setFilteredSearch] = useState('');
  const [messageObj, setMessageObj] = useState(null);

  useEffect(() => {
    personsService
      .getAll()
      .then(data => setPersons(data))
      .catch(e => console.log(e.message));
  }, []);

  const namesToDisplay = filteredSearch
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filteredSearch.toLowerCase())
      )
    : persons;

  const handleSubmit = e => {
    e.preventDefault();

    const personExists = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (personExists && number) {
      if (
        confirm(
          `${personExists.name} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        personsService
          .updateEntry(personExists.id, { ...personExists, number })
          .then(data =>
            setPersons(prevPersons =>
              prevPersons.map(person =>
                person.id !== personExists.id ? person : data
              )
            )
          )
          .catch(() => {
            displayNotification(
              `Information of ${personExists.name} has already been removed from server`,
              'error'
            );
            setPersons(prevPersons =>
              prevPersons.filter(person => person.id !== personExists.id)
            );
          });

        displayNotification(
          `Updated number of ${personExists.name}`,
          'success'
        );
        setNewName('');
        setNumber('');
        return;
      } else {
        return;
      }
    }

    if (personExists) {
      alert(`${personExists.name} is already added to the phonebook`);
      return;
    }

    personsService
      .postPerson({
        name: newName,
        number,
      })
      .then(data => setPersons(prev => [...prev, data]))
      .catch(e => console.log(e.message));
    displayNotification(`Added ${newName}`, 'success');
    setNewName('');
    setNumber('');
  };

  const displayNotification = (message, type) => {
    setMessageObj({ message, type });
    setTimeout(() => {
      setMessageObj(null);
    }, 5000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {messageObj ? <Notification messageObj={messageObj} /> : null}
      <Filter
        filteredSearch={filteredSearch}
        setFilteredSearch={setFilteredSearch}
      />
      <h3>Add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        number={number}
        setNumber={setNumber}
      />
      <h3>Numbers</h3>
      <Persons namesToDisplay={namesToDisplay} setPersons={setPersons} />
    </div>
  );
};

export default App;
