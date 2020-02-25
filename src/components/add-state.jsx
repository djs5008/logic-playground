import React from 'react';
import InitialState from './add-states/initial-state';
import GateState from './add-states/add-gates';
import InputState from './add-states/add-inputs';
import OutputState from './add-states/add-outputs';
import ImportState from './add-states/add-import';
import './css/add-state.css';

import { connect } from 'react-redux';

export const AddStates = {
  INITIAL:  'Components',
  GATE:     'Gates',
  INPUT:    'Inputs',
  OUTPUT:   'Outputs',
  IMPORT:   'Modules',
}

const mapStateToProps = (state) => {
  return {
    addState: state.addState,
  };
};

export default connect(mapStateToProps, null)(
  class AddState extends React.Component {
    render() {
      return (
        <React.Fragment>
          <div className={this.props.addState === AddStates.GATE ? 'container' : 'hidden'} >
            <GateState />
          </div>
          <div className={this.props.addState === AddStates.INPUT ? 'container' : 'hidden'} >
            <InputState />
          </div>
          <div className={this.props.addState === AddStates.OUTPUT ? 'container' : 'hidden'} >
            <OutputState />
          </div>
          <div className={this.props.addState === AddStates.IMPORT ? 'container' : 'hidden'}  >
            <ImportState />
          </div>
          <div className={this.props.addState === AddStates.INITIAL ? 'container' : 'hidden'} >
            <InitialState />
          </div>
        </React.Fragment>
      )
    }

  }
);