import React from 'react';
import { connect } from 'react-redux';
import { } from '../../actions/actions.js';
import ControlButton from '../control-button.jsx';
import '../css/add-component.css';
import { getFileController, getModuleController } from '../../lpg/core.js';

const mapStateToProps = (state) => {
  return {
    settingsState: state.settingsState,
    activeModules: state.activeModules,
  }
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(
  class ModuleSettings extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        moduleName: ((this.props.activeModules[0] && this.props.activeModules[0].label) || 'unnamed'),
      }
    }

    componentWillReceiveProps(props) {
      this.setState({
        moduleName: ((props.activeModules[0] && props.activeModules[0].label) || 'unnamed'),
      });
    }

    saveModule() {
      console.info(JSON.stringify(this.props.activeModules[0]));
      localStorage.setItem('autosaveModule', JSON.stringify(this.props.activeModules[0]));
    }

    newModule() {
      if (window.confirm('Are you sure? You will lose anything not saved!')) {
        getModuleController().newModule();
      }
    }

    loadModule() {
      getFileController().loadModuleFile(getFileController().loadModule);
    }

    exportModule() {
      const content = JSON.stringify(this.props.activeModules[0]);
      const filename = this.props.activeModules[0].label + '.lpm';
  
      let file = new Blob([content], { type: 'application/octet-stream' });
      let exportModuleDialog = document.getElementById('export-module-dialog');
  
      exportModuleDialog.setAttribute('href', URL.createObjectURL(file));
      exportModuleDialog.setAttribute('download', filename);
      exportModuleDialog.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }

    importModule() {
      getFileController().loadModuleFile(getFileController().importModule);
    }

    updateModuleName(name) {
      if (this.props.activeModules[0]) {
        this.setState({
          moduleName: name,
        });
        this.props.activeModules[0].label = name;
      }
    }

    render() {
      return (
        <React.Fragment>
          <div className='Content-Container'>
            <ControlButton onClick={this.newModule.bind(this)}>
              New
            </ControlButton>
            <ControlButton onClick={this.saveModule.bind(this)}>
              Save
            </ControlButton>
            <ControlButton onClick={this.loadModule.bind(this)}>
              Load
            </ControlButton>
            <ControlButton onClick={this.exportModule.bind(this)}>
              Export
            </ControlButton>
            <ControlButton onClick={this.importModule.bind(this)}>
              Import
            </ControlButton>
          </div>
          <hr />
          <label htmlFor='active-module-name' className='ActiveModuleLabel'>Current Module:</label>
          <input
            id='active-module-name'
            type='text'
            value={this.state.moduleName}
            className='ActiveModuleName'
            onInput={(evt) => this.updateModuleName(evt.target.value)}
            onChange={(evt) => this.updateModuleName(evt.target.value)}
            onPaste={(evt) => this.updateModuleName(evt.target.value)}
          />
        </React.Fragment>
      );
    }

  }
);