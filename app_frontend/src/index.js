import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './App';

import LoginStore from "./component/reduxStore/LoginStore";
import store from "./sample/store/counter";

import './index.css';

ReactDOM.render(
  <Provider store={ store, LoginStore }>
    <App />
  </Provider>,
  document.getElementById('root')
);
