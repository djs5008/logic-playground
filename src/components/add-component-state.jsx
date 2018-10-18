import React from 'react';
import InitialState from './add-states/initial-state';
import GateState from './add-states/add-gates';
import InputState from './add-states/add-inputs';
import OutputState from './add-states/add-outputs';
import ImportState from './add-states/add-import';

import { connect } from 'react-redux';

export const States = {
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
  class AddComponentState extends React.Component {

    getCurrentState() {
      switch (this.props.addState) {
        case States.GATE: return <GateState />;
        case States.INPUT: return <InputState />;
        case States.OUTPUT: return <OutputState />;
        case States.IMPORT: return <ImportState />;
        default: return <InitialState />
      }
    }

    render() {
      return (this.getCurrentState());
    }

  }
);