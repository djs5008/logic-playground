import React from 'react';
import ControlButton from '../control-button';
import { AddStates } from '../add-state';
import '../css/add-component.css';

import { connect } from 'react-redux';
import { setAddState } from '../../actions/actions.js';

const mapDispatchToProps = {
  setAddState,
};

export default connect(null, mapDispatchToProps)(
  class InitialState extends React.Component {

    render() {
      return (
        <div className='Content-Container'>
          <ControlButton onClick={() => this.props.setAddState(AddStates.GATE)}>
            Gates
          </ControlButton>
          <ControlButton onClick={() => this.props.setAddState(AddStates.INPUT)}>
            Inputs
          </ControlButton>
          <ControlButton onClick={() => this.props.setAddState(AddStates.OUTPUT)}>
            Outputs
          </ControlButton>
          <ControlButton onClick={() => this.props.setAddState(AddStates.IMPORT)}>
            Modules
          </ControlButton>
        </div>
      );
    }

  }
);