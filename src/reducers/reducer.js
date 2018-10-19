import { AddStates } from '../components/add-state';
import { SettingStates } from '../components/settings-state';

const DEFAULT_STATE = {
  activeModule:   undefined,
  activeModules:  [],
  addState:       AddStates.INITIAL,
  settingsState:  SettingStates.MODULE,
  gateTypes:      [],
  inputTypes:     [],
  outputTypes:    [],
  imports:        [],
  compSettings:   [],
};

const reducers = (state = DEFAULT_STATE, action) => {

  switch (action.type) {
    case 'SET_ACTIVE_MODULE':
      return {
        ...state,
        activeModule: action.payload,
      };
    case 'SET_MODULE_NAME':
      return {
        ...state,
        activeModule: {
          ...state.activeModule,
          label: action.payload,
        }
      }
    case 'SET_ADDSTATE':
      return {
        ...state,
        addState: action.payload,
      };
    case 'SET_SETTINGS_STATE':
      return {
        ...state,
        settingsState: action.payload,
      }
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
    case 'ADD_COMPONENT_SETTING':
      return {
        ...state,
        compSettings: [...state.compSettings, action.payload],
      }
    case 'CLEAR_COMPONENT_SETTING':
      return {
        ...state,
        compSettings: [],
      }
    default: return state;
  }

};

export default reducers;