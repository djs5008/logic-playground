import React from 'react';
import './css/control-button.css';

export default class ControlButton extends React.Component {

  handleClick() {}

  render() {
    return (
      <button className='ControlButton' onClick={this.props.onClick || this.handleClick}>
        {this.props.children || this.props.value}
      </button>
    );
  }

}