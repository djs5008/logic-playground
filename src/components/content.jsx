import React from 'react';
import './css/app.css';
import '../lpg/core';
import ControlBar from './control-bar';
import Canvas from './canvas';
import AddState from './add-state';
import SettingsState from './settings-state';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    addState: state.addState,
    settingsState: state.settingsState,
  };
};

export default connect(mapStateToProps, null)(
  class Content extends React.Component {
    render() {
      return (
        <React.Fragment>
          <ControlBar title={`Add ${this.props.addState}`}>
            <AddState />
          </ControlBar>
          <Canvas />
          <ControlBar title={`${this.props.settingsState} Controls`}>
            <SettingsState />
          </ControlBar>
        </React.Fragment>
      );
    }
  }
);