import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Message from '../pages/Message';
import Signin from '../pages/Signin';
import Edit from '../pages/Edit';
import Calling from '../pages/Calling';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'register',
        element: <Signup />,
      },
      {
        path: 'signin',
        element: <Signin />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'edit',
        element: <Edit />,
      },
      {
        path: 'call',
        element: <Calling />,
      },
    ],
  },
]);

export default router;
