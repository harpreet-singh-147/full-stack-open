import { useContext } from 'react';

import NotificationContext from '../context/NotificationContext';

export const useNotificationValue = () => {
  const [value] = useContext(NotificationContext);
  return value;
};

export const useNotificationDispatch = () => {
  const [, dispatch] = useContext(NotificationContext);
  return dispatch;
};
