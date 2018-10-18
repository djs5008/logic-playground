import React from 'react';
import './css/control-button.css';

export default class ControlButton extends React.Component {

  render() {
    return (
      <button className='ControlButton'>
        {this.props.children}
      </button>
    );
  }

}