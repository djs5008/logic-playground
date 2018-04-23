define(function (require) {
  'use strict';

  // 
  // Includes
  // 
  var Component = require('model/component');

  class Input extends Component {

    /**
     * Input constructor
     */
    constructor(type, superType, bounds, toggleable) {
      super(type, superType, bounds);
      this.toggleable = toggleable;
    }

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

    /**
     * Check whether this input component is manually toggleable
     */
    isToggleable() {
      return this.toggleable;
    }
  }

  return Input;
});