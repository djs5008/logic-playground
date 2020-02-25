// 
// Includes
// 
import Component from '../component'; 

// 
// Constants
// 

// 
// Attributes
// 

export default class Gate extends Component {

  /**
   * Default Gate propagate prototype function
   */
  propagate() { }

  /**
   * Setup the gate
   */
  setupGate() { }

  /**
   * Override createEvent from Component to handle dropping
   */
  createEvent() {
    this.setupGate();
    this.propagate();
  }
}