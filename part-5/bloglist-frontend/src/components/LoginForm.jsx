const LoginForm = ({
  handleSubmit,
  username,
  password,
  setUsername,
  setPassword,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  );
};
export default LoginForm;
