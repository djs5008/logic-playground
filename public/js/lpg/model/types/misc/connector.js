/* global createjs,uuid */

define(function (require) {
  'use strict';

  // 
  // Includes
  // 
  var Component = require('model/component');

  // 
  // Constants
  // 
  const RADIUS = 5;

  class Connector extends Component {

    /**
     * Connector Constructor
     * 
     * @param {*} bounds 
     * @param {*} type 
     */
    constructor(bounds, type) {
      super('CONNECTOR', 'MISC', bounds);

      this.bounds.width = RADIUS;
      this.bounds.height = RADIUS;

      this.state = false;
      this.type = type;
      this.id = uuid();
      this.connections = [];
    }

    getRealBounds() {
      return new createjs.Rectangle(this.bounds.x - RADIUS, this.bounds.y - RADIUS, RADIUS * 2, RADIUS * 2);
    }

    getState() {
      return this.state;
    }

    updateState(newState) {
      this.state = newState;
    }

    isInput() {
      return this.type === 'INPUT';
    }

    isOutput() {
      return this.type === 'OUTPUT';
    }

    getID() {
      return this.id;
    }

    addConnection(connector) {
      this.connections.push(connector.getID());
    }

    removeConnection(connector) {
      this.connections = this.connections.filter(val => val !== connector.getID());
    }

    getConnections() {
      return this.connections;
    }

    /**
     * Paint the component
     * 
     * @param {createjs.Graphics} graphics The graphics object being painted to
     * @param {createjs.Point} screenPos The canvas location of the paint procedure
     */
    paint(graphics, screenLoc) {
      var color = (this.getState()) ? 'rgb(0,200,0)' : 'rgb(200,0,0)';
      graphics.beginFill(color)
        .drawCircle(screenLoc.x, screenLoc.y, this.bounds.width)
        .endFill();
    }
  }

  return Connector;
});