/* global $ */
define((require) => {
  'use strict';

  // 
  // Includes
  // 
  var Component = require('model/component');

  class Input extends Component {

    /**
     * Construct an Input-type component
     * 
     * @param {string} type 
     * @param {string} superType 
     * @param {createjs.Rectangle} bounds 
     * @param {boolean} toggleable Whether or not the input is manually toggleable
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

    /**
     * Input Component settings loader
     * 
     * @param elem The DOM element the settings are being loaded into
     */
    loadSettings(elem) {
      super.loadSettings(elem);
      let me = this;
      let labelControlID = 'label-control';
      let labelControlHTML = '<button id="' + labelControlID + '" class="module controls" type="button">Set Label</button>'; 
      elem.append(labelControlHTML);
      $('#' + labelControlID).on('click', () => {
        let newLabel = prompt('Enter new label:', me.label);
        me.label = (newLabel === null) ? me.label : newLabel;
      });
    }
  }

  return Input;
});