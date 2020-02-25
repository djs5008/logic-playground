// 
// Includes
// 
import Component from '../component';

export default class Input extends Component {

  /**
   * Set the state of this input component
   * 
   * @param {boolean} newState 
   */
  setState(newState) {
    return this.connectors[0].updateState(newState);
  }

  /**
   * Get the state of this input component
   * 
   * @returns {boolean} The state of the component 
   */
  getState() {
    return this.connectors[0].getState();
  }
}