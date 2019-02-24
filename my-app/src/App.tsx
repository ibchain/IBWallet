import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './common/store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      </Provider>
    );
  }
}

export default App;
