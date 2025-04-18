import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';


import App from './App';
import store from './context/store';


import './utils/i18n';
import "bootstrap/dist/css/bootstrap.min.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

