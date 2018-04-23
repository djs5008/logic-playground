define(function (require) {
  'use strict';

  // 
  // Includes
  // 
  var Component = require('model/component');

  class Output extends Component {
    /**
     * Output constructor
     */
    constructor(type, superType, bounds) {
      super(type, superType, bounds);
    }

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
  }

  return Output;
});