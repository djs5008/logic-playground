import { States } from '../components/add-component-state';

const DEFAULT_STATE = {
  activeModule:   undefined,
  addState:       States.INITIAL,
  gateTypes:      [],
  inputTypes:     [],
  outputTypes:    [],
  imports:        [],
};

const reducers = (state = DEFAULT_STATE, action) => {

  switch (action.type) {
    case 'SET_ADDSTATE':
      return {
        ...state,
        addState: action.payload,
      };
    case 'ADD_GATE_TYPE':
      return {
        ...state,
        gateTypes: [...state.gateTypes, action.payload],
      };
    case 'ADD_INPUT_TYPE':
      return {
        ...state,
        inputTypes: [...state.inputTypes, action.payload],
      };
    case 'ADD_OUTPUT_TYPE':
      return {
        ...state,
        outputTypes: [...state.outputTypes, action.payload],
      };
    case 'ADD_IMPORT':
      return {
        ...state,
        imports: [...state.imports, action.payload],
      };
    default: return state;
  }

};

export default reducers;