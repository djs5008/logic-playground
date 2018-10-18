import React from 'react';
import './css/control-bar.css';

export default class ControlBar extends React.Component {
  
  render() {
    return (
      <div className='ControlBar'>
        <h5 className='ControlBar-Title'>{this.props.title || ''}</h5>
        <hr />
        <div className='ControlBar-Content'>
          {this.props.children}
        </div>
      </div>
    );
  }

}