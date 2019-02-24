import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import amplifyConfigure from './config/amplify';
import { Logger } from 'aws-amplify';

// Debug flag
if (window.location.hostname.indexOf('localhost') >= 0) {
  Logger.LOG_LEVEL = 'DEBUG';
  console.log('hostname = ', window.location.hostname)
  const flag = '*'
  console.log('debug: ' + flag)
  localStorage.setItem('debug', flag)
} else {
  // localStorage.removeItem('debug')
}

// AWS Access
amplifyConfigure();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

