import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store.js';
import Content from './content';

import './css/app.css';

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
          { /* Hidden fields for loading/saving modules */ }
          <form>
            <a id='export-module-dialog' style={{ visibility: 'hidden' }} href='.'>placeholder</a>
            <input type='file' id='load-module-dialog' name='load-module-dialog' style={{ visibility: 'hidden' }} />
          </form>
          <p className='Copyright'>
            Copyright &copy; { new Date().getFullYear() } LPG
          </p>
        </div>
      </Provider>
    );
  }
}