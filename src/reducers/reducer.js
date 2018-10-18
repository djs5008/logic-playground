import { States } from '../components/add-component-state';

const DEFAULT_STATE = {
  activeModule: undefined,
  addState: States.INITIAL,
};

const reducers = (state = DEFAULT_STATE, action) => {

  switch (action.type) {
    case 'SET_ADDSTATE':
      return {
        ...state,
        addState: action.payload,
      }
    default: return state;
  }

};

export default reducers;