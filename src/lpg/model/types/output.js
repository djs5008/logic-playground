// 
// Includes
// 
import Component from '../component';

export default class Output extends Component {

  /**
   * Set the state of this output component
   * 
   * @param {boolean} newState 
   */
  setState(newState) {
    return this.connectors[0].updateState(newState);
  }

  /**
   * Get the state of this output component
   * 
   * @returns {boolean} The state of the component 
   */
  getState() {
    return this.connectors[0].getState();
  }

  /**
   * Perform an action when the state is changed
   */
  stateChangedEvent() {}
}