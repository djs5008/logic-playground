import React from 'react';
import ControlButton from '../control-button';
import { States } from '../add-component-state';
import '../css/add-component.css';

export default class InitialState extends React.Component {

  render() {
    return (
      <div className='Content-Container'>
        <ControlButton onClick={ () => this.props.setAddState(States.GATE) }>
          Gates
        </ControlButton>
        <ControlButton onClick={ () => this.props.setAddState(States.INPUT) }>
          Inputs
        </ControlButton>
        <ControlButton onClick={ () => this.props.setAddState(States.OUTPUT) }>
          Outputs
        </ControlButton>
        <ControlButton onClick={ () => this.props.setAddState(States.IMPORT) }>
          Modules
        </ControlButton>
      </div>
    );
  }

}