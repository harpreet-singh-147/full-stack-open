import { createContext, useReducer } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'DISPLAY_CREATED_NOTIFICATION':
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

export default NotificationContext;
