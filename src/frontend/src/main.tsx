import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './components/login';
import FormsPage from './components/forms';
import RegisterIndex from './components/register';
import Profile from './components/profile';
import IntegrationApp from './components/integration_app/integration_iframe';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <RegisterIndex />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/integration-app",
    element: <IntegrationApp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
