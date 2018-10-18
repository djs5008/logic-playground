import React from 'react';
import InitialState from './add-states/initial-state';
import GateState from './add-states/add-gates';
import InputState from './add-states/add-inputs';
import OutputState from './add-states/add-outputs';
import ImportState from './add-states/add-import';

export const States = {
  INITIAL:  'initial',
  GATE:     'gate',
  INPUT:    'input',
  OUTPUT:   'output',
  IMPORT:   'import',
}

export default class AddComponentState extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addState: States.INITIAL,
    };
  }

  setAddState(state) {
    this.setState({
      addState: state,
    });
  }

  getCurrentState() {
    switch (this.state.addState) {
      case States.GATE: return <GateState setAddState={this.setAddState.bind(this)} />;
      case States.INPUT: return <InputState setAddState={this.setAddState.bind(this)} />;
      case States.OUTPUT: return <OutputState setAddState={this.setAddState.bind(this)} />;
      case States.IMPORT: return <ImportState setAddState={this.setAddState.bind(this)} />;
      default: return <InitialState setAddState={this.setAddState.bind(this)} />
    }
  }

  render() {
    return (this.getCurrentState());
  }

}