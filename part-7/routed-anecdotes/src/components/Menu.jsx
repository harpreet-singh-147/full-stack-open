import { Link } from 'react-router-dom';

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <>
      <Link to='/' style={padding}>
        anecdotes
      </Link>
      <Link to='/create' style={padding}>
        create new
      </Link>
      <Link to='/about' style={padding}>
        about
      </Link>
    </>
  );
};

export default Menu;

{
  /* <div>
  <Link style={padding} to='/'>
    home
  </Link>
  <Link style={padding} to='/notes'>
    notes
  </Link>
  <Link style={padding} to='/users'>
    users
  </Link>
</div>; */
}
