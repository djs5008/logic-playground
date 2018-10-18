export const setAddState = (state) => (
  {
    type: 'SET_ADDSTATE',
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