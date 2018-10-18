import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store.js';
import './css/app.css';
import '../lpg/core';
import Content from './content';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className='Root'>
          <a href='/' style={{ 'textDecoration': 'none' }} >
            <h1 className='Title'>
              Logic Playground
            </h1>
          </a>
          <div className='App'>
            <Content />
          </div>
          <p className='Copyright'>
            Copyright &copy; { new Date().getFullYear() } LPG
          </p>
        </div>
      </Provider>
    );
  }
}