import ReactDOM from 'react-dom/client';
import App from './App';

import { NotificationContextProvider } from './context/NotificationContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </NotificationContextProvider>
);
