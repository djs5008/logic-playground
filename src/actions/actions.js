export const setActiveModule = (module) => (
  {
    type: 'SET_ACTIVE_MODULE',
    payload: module,
  }
);

export const setAddState = (state) => (
  {
    type: 'SET_ADDSTATE',
    payload: state,
  }
);

export const setSettingsState = (state) => (
  {
    type: 'SET_SETTINGS_STATE',
    payload: state,
  }
);

export const addGateType = (comp) => (
  {
    type: 'ADD_GATE_TYPE',
    payload: comp,
  }
);

export const addInputType = (comp) => (
  {
    type: 'ADD_INPUT_TYPE',
    payload: comp,
  }
);

export const addOutputType = (comp) => (
  {
    type: 'ADD_OUTPUT_TYPE',
    payload: comp,
  }
);

export const addImport = (comp) => (
  {
    type: 'ADD_IMPORT',
    payload: comp,
  }
);

export const addComponentSetting = (setting) => (
  {
    type: 'ADD_COMPONENT_SETTING',
    payload: setting,
  }
);

export const clearComponentSettings = () => (
  {
    type: 'CLEAR_COMPONENT_SETTING',
  }
);

export const setModuleName = (name) => (
  {
    type: 'SET_MODULE_NAME',
    payload: name,
  }
);