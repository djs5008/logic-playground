import React from 'react';
import { connect } from 'react-redux';
import {  } from '../../actions/actions.js';

const mapStateToProps = (state) => {
  return {
    settingsState: state.settingsState,
  }
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(
  class ComponentSettings extends React.Component {

    render() {
      return (
        <React.Fragment>

        </React.Fragment>
      );
    }

  }
);