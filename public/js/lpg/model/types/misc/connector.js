/* global createjs */
define((require) => {
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
     * @param {createjs.Rectangle} bounds 
     * @param {string} type 
     */
    constructor(bounds, type) {
      super('CONNECTOR', 'MISC', bounds);

      this.bounds.width = RADIUS;
      this.bounds.height = RADIUS;

      this.state = false;
      this.type = type;
      this.connections = [];
    }

    /**
     * Retrieve different bounds allowing for selection handling to be easier
     */
    getRealBounds() {
      return new createjs.Rectangle(this.bounds.x - RADIUS, this.bounds.y - RADIUS, RADIUS * 2, RADIUS * 2);
    }

    /**
     * Retrieve connector state information
     * 
     * @returns true === on, false === off
     */
    getState() {
      return this.state;
    }

    /**
     * Update the connector state to a new value
     * 
     * @param {boolean} newState The newly updated state value
     */
    updateState(newState) {
      this.state = newState;
    }

    /**
     * Check if this connector is an input connector
     */
    isInput() {
      return this.type === 'INPUT';
    }

    /**
     * Check if this connector is an output connector
     */
    isOutput() {
      return this.type === 'OUTPUT';
    }

    /**
     * Retrieve the auto-generated universally unique identifier (uuid)
     *  This is specific to each connector and allows the application to map
     *  connectors to their associated connections.
     */
    getID() {
      return this.id;
    }

    /**
     * Establish a connection mapping between this connector and the provided connectors
     * 
     * @param {Connector} connector The connector being connected to
     */
    addConnection(connector) {
      this.connections.push(connector.getID());
    }

    /**
     * Remove the mapping between this connector and the provided connector
     *  This will have no effect if the connector is not mapped
     * 
     * @param {Connector} connector The connector being unmapped
     */
    removeConnection(connector) {
      this.connections = this.connections.filter(val => val !== connector.getID());
    }

    /**
     * Retrieve the list of mapped connections for this connector
     */
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