import React from 'react';
import { connect } from 'react-redux';
import {  } from '../../actions/actions.js';
import ControlButton from '../control-button.jsx';
import '../css/add-component.css';

const mapStateToProps = (state) => {
  return {
    settingsState: state.settingsState,
    activeModule: state.activeModule,
  }
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(
  class ModuleSettings extends React.Component {

    getModuleName() {
      return ('' || (this.props.activeModule && this.props.activeModule.label));
    }

    render() {
      return (
        <React.Fragment>
          <div className='Content-Container'>
            <ControlButton>
              New
            </ControlButton>
            <ControlButton>
              Save
            </ControlButton>
            <ControlButton>
              Load
            </ControlButton>
            <ControlButton>
              Export
            </ControlButton>
            <ControlButton>
              Import
            </ControlButton>
          </div>
          <hr />
          <label for='active-module-name' className='ActiveModuleLabel'>Current Module:</label>
          <input id='active-module-name' type='text' value={this.getModuleName()} className='ActiveModuleName' />
        </React.Fragment>
      );
    }

  }
);