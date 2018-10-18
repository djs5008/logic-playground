import React, { Component } from 'react';
import './css/app.css';
import '../lpg/core';
import ControlBar from './control-bar';
import AddComponentState from './add-component-state';
import Canvas from './canvas';

class App extends Component {
  render() {
    return (
      <div className='Root'>
        <a href='/' style={{ 'textDecoration': 'none' }} >
          <h1 className='Title'>
            Logic Playground
          </h1>
        </a>
        <div className='App'>
          <ControlBar title='Add Components'>
            <AddComponentState/>
          </ControlBar>
          <Canvas />
          <ControlBar title='Module Controls' />
        </div>
        <p className='Copyright'>
          Copyright &copy; { new Date().getFullYear() } LPG
        </p>
      </div>
    );
  }
}

export default App;
