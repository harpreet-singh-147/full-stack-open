import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'DISPLAY_VOTE_NOTIFICATION':
      return { message: action.payload };
    case 'DISPLAY_ERROR_NOTIFICATION':
      return { message: action.payload };
    case 'CLEAR_NOTIFICATION':
      return { message: '' };
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = props => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: '',
  });

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationContext;
