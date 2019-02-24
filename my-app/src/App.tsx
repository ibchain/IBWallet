import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import store from './common/store';
import browserHistory from './common/history';
import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
        </Router>
      </Provider>
    );
  }
}

export default App;
