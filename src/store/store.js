import { createStore } from 'redux';
import reducers from '../reducers/reducer';

export const store = createStore( reducers );