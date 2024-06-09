import { useState } from 'react';

import blogService from '../services/blogs';

const Blog = ({ blog, setBlogs, displayNotification }) => {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem('loggedBlogAppUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    padding: '0.5rem',
  };

  const buttonStyle = {
    background: 'blue',
    color: 'white',
  };

  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLikeClick = async id => {
    try {
      const res = await blogService.updateLikes(id, {
        ...blog,
        likes: blog.likes + 1,
      });

      setBlogs(prevBlogs =>
        prevBlogs.map(blog => {
          return blog.id !== res.id ? blog : res;
        })
      );
    } catch (e) {
      console.log(e);
      displayNotification('an error occured', 'error');
    }
  };

  const handleRemoveBlogClick = async (id, title, author) => {
    if (confirm(`Remove blog ${title} by ${author}?`)) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(prevBlogs => prevBlogs.filter(prevBlog => prevBlog.id !== id));
      } catch (e) {
        console.log(e);
        displayNotification('an error occured', 'error');
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div className='blog__content'>
        {blog.title}{' '}
        <button onClick={toggleVisibility} className='blog__toggle-btn'>
          {visible ? 'hide' : 'view'}
        </button>
        <div style={showWhenVisible}>
          <div className='blog__url'>{blog.url}</div>
          <div className='blog__likes'>
            {blog.likes}{' '}
            <button onClick={() => handleLikeClick(blog.id)}>like</button>
          </div>
          <div>{blog.author}</div>
          {user?.username === blog.user?.username ? (
            <button
              style={buttonStyle}
              onClick={() =>
                handleRemoveBlogClick(blog.id, blog.title, blog.author)
              }
            >
              remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Blog;
