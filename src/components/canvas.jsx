import React from 'react';
import './css/canvas.css';

export default class Canvas extends React.Component {
  
  render() {
    return (
      <div>
        <canvas id='logic-canvas' className='Canvas' width={0} height={0} />
        {/* <p className='Canvas-Loading'>Loading...</p> */}
      </div>
    );
  }

}