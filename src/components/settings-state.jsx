import React from 'react';
import { connect } from 'react-redux';
import ModuleSettings from './settings-states/module-settings';
import ComponentSettings from './settings-states/component-settings';

const mapStateToProps = (state) => {
  return {
    settingsState: state.settingsState,
  }
};

export const SettingStates = {
  MODULE: 'Module',
  COMPONENT: 'Component',
};

export default connect(mapStateToProps, null)(
  class SettingsState extends React.Component {

    getSettingsState() {
      switch (this.props.settingsState) {
        case SettingStates.COMPONENT: return <ComponentSettings />
        case SettingStates.MODULE:  
        default: return <ModuleSettings />;
      }
    }

    render() {
      return (this.getSettingsState());
    }

  }
);