const Notification = ({ messageObj }) => {
  const notificationClassName =
    messageObj.type === 'error' ? 'error' : 'success';

  return <div className={notificationClassName}>{messageObj.message}</div>;
};
export default Notification;
