import { useNavigate } from 'react-router-dom';

import { useField } from '../hooks';

const CreateNew = ({ addNew }) => {
  const { inputProps: content, reset: resetContent } = useField('text');
  const { inputProps: author, reset: resetAuthor } = useField('text');
  const { inputProps: info, reset: resetInfo } = useField('text');

  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate('/');
  };

  const reset = () => {
    resetContent();
    resetAuthor();
    resetInfo();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button type='button' onClick={reset}>
          reset
        </button>
      </form>
    </div>
  );
};
export default CreateNew;
