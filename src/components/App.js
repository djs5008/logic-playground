import React, { Component } from 'react';
import '../css/App.css';
import Canvas from './canvas';
import '../lpg/core';

class App extends Component {
  render() {
    return (
      <div>
        <div className='App'>
          <Canvas/>
        </div>
      </div>
    );
  }
}

export default App;
