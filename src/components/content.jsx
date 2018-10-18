import React from 'react';
import './css/app.css';
import '../lpg/core';
import ControlBar from './control-bar';
import AddComponentState from './add-component-state';
import Canvas from './canvas';

import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    addState: state.addState,
  };
};

export default connect(mapStateToProps, null)(
  class Content extends React.Component {
    render() {
      return (
        <React.Fragment>
          <ControlBar title={`Add ${this.props.addState}`}>
            <AddComponentState />
          </ControlBar>
          <Canvas />
          <ControlBar title='Module Controls' />
        </React.Fragment>
      );
    }
  }
);