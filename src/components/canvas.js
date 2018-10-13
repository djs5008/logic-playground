import React from 'react';
import '../css/Canvas.css';

export default class Canvas extends React.Component {
  
  render() {
    return (
      <div>
        <canvas id='logic-canvas' className='Canvas' />
        {/* <p className='Canvas-Loading'>Loading...</p> */}
      </div>
    );
  }

}