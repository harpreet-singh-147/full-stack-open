import { useResource, useField } from '../hooks';

const CreateNote = () => {
  const { inputProps: content, reset: resetNote } = useField('text');
  const [notes, noteService] = useResource('http://localhost:3005/notes');

  const handleNoteSubmit = event => {
    event.preventDefault();
    noteService.create({ content: content.value });
    resetNote();
  };

  return (
    <>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes?.map(n => (
        <p key={n.id}>{n.content}</p>
      ))}
    </>
  );
};
export default CreateNote;
