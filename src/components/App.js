import React, { Component } from 'react';
import '../css/App.css';
import '../lpg/core';
import ControlBar from './control-bar';
import Canvas from './canvas';

class App extends Component {
  render() {
    return (
      <div className='Root'>
        <a href='' style={{ 'text-decoration': 'none' }} >
          <h1 className='Title'>
            Logic Playground
          </h1>
        </a>
        <div className='App'>
          <ControlBar />
          <Canvas />
          <ControlBar />
        </div>
        <caption className='Copyright'>
          Copyright &copy; { new Date().getFullYear() } LPG
        </caption>
      </div>
    );
  }
}

export default App;
