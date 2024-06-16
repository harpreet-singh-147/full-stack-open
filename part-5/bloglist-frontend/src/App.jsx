import { useState, useEffect, useRef } from 'react';

import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import CreateBlog from './components/CreateBlog';
import Notification from './components/Notification';

import Togglable from './components/Togglable';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [messageObj, setMessageObj] = useState(null);

  const createBlogRef = useRef(null);

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))
      .catch(e => {
        console.log(e);
        displayNotification(`${e.response.data.error}`, 'error');
      });
  }, []);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      console.log(e);
      displayNotification(`${e.response.data.error}`, 'error');
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const displayNotification = (message, type) => {
    setMessageObj({ message, type });
    setTimeout(() => {
      setMessageObj(null);
    }, 5000);
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const renderOutput = () => {
    if (user) {
      return (
        <>
          <h2>blogs</h2>
          {messageObj ? <Notification messageObj={messageObj} /> : null}
          <p>
            <span>{user.name} logged in</span>{' '}
            <span>
              <button onClick={handleLogoutClick}>logout</button>
            </span>
          </p>
          <Togglable buttonLabel='create new blog' ref={createBlogRef}>
            <CreateBlog
              setBlogs={setBlogs}
              displayNotification={displayNotification}
              ref={createBlogRef}
            />
          </Togglable>
          {sortedBlogs.map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              setBlogs={setBlogs}
              displayNotification={displayNotification}
              user={user}
            />
          ))}
        </>
      );
    } else {
      return (
        <>
          <h1>log in to application</h1>
          {messageObj ? <Notification messageObj={messageObj} /> : null}
          <LoginForm
            handleSubmit={handleSubmit}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </>
      );
    }
  };

  return renderOutput();
};

export default App;
