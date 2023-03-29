import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NewsletterUnsubscribe from './components/NewsletterUnsubscribe';

const root = ReactDOM.createRoot(document.getElementById('root'));

const BrowserRouter = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/unsubscribe/:category/:userId', element: <NewsletterUnsubscribe /> },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={BrowserRouter}/>
  </React.StrictMode>
);


