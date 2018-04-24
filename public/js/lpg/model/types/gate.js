define(function (require) {
  'use strict';

  // 
  // Includes
  // 
  var Component = require('model/component');
  var Logic = require('model/logic');

  // 
  // Constants
  // 

  // 
  // Attributes
  // 
  var logic = new Logic();

  class Gate extends Component {

    /**
     * Construct a Gate-type component
     * 
     * @param {string} type 
     * @param {string} superType 
     * @param {createjs.Rectangle} bounds 
     */
    constructor(type, superType, bounds) {
      super(type, superType, bounds);
    }

    /**
     * Default Gate propagate prototype function
     */
    propagate() { }

    /**
     * Retrieve global gate's logic functions
     * @returns {Logic} Instance of logic functions
     */
    getLogic() {
      return logic;
    }
  }

  return Gate;
});