import { useState, forwardRef } from 'react';

import blogService from '../services/blogs';

const CreateBlog = forwardRef(({ setBlogs, displayNotification }, refs) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !author || !url) {
      displayNotification(
        'Title, author, and URL must all be provided',
        'error'
      );
      return;
    }
    try {
      const res = await blogService.create({ title, author, url });

      setBlogs(prevBlogs => [res, ...prevBlogs]);
      displayNotification(
        `a new blog ${res.title} by ${res.author} added`,
        'success'
      );
      setTitle('');
      setAuthor('');
      setUrl('');
      refs?.current?.toggleVisibility();
    } catch (e) {
      console.log(e);
      displayNotification('an error occured while adding the blog', 'error');
    }
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type='text'
            value={title}
            name='Title'
            onChange={e => setTitle(e.target.value)}
            placeholder='enter blog title'
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            name='Author'
            onChange={e => setAuthor(e.target.value)}
            placeholder='enter blog author'
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='Url'
            onChange={e => setUrl(e.target.value)}
            placeholder='enter blog url'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  );
});
export default CreateBlog;

CreateBlog.displayName = 'CreateBlog';
