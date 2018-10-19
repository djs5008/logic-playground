import React from 'react';
import './css/canvas.css';
import BackButton from './back-button';

export default class Canvas extends React.Component {
  
  render() {
    return (
      <div>
        <BackButton />
        <canvas id='logic-canvas' className='Canvas' width={0} height={0} />
      </div>
    );
  }

}