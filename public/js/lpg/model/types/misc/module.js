// 
// Includes
// 
import { Connector } from './connector';
import { Gate } from '../../types/gate';

// 
// Constants
// 
const DEFAULT_LABEL = 'unnamed';
const EXTERNAL_WIDTH_DEFAULT = 40;
const EXTERNAL_HEIGHT_DEFAULT = 20;

export class Module extends Gate {

  /**
   * Module Constructor
   * 
   * @param {createjs.Rectangle} bounds 
   */
  constructor(bounds) {
    super('MODULE', 'MODULE', bounds);
    this.label = DEFAULT_LABEL;
    this.components = [];
    this.startPos = { x: 0, y: 0 };
    this.connectorMap = {};
    this.updateBounds();
    this.updateConnectorMap();
    this.propagate();
  }

  /**
   * Override propagate functionality
   */
  propagate(activeModule) {
    let me = this;

    /** 
     * Update all inputs based on connected outputs
     *  If any of the states are on, the input state will be in the on state.
     */
    let updateConnections = function(connector) {
      let newState = false;
      connector.getConnections().forEach(connFromID => {
        if (newState) return;
        let connFrom = me.getOutputConnectorFromID(connFromID);
        if (connFrom.getState()) {
          newState = true;
          return;
        }
      });
      
      // Update connectors to match state
      //  false => false, true => true
      if (connector.getState() !== newState) {
        connector.updateState(newState);

        // Retrieve which component was updated
        let compUpdated = me.getComponent(connector);

        // Propagate updated gate immediately
        if (compUpdated.isGate()) {
          compUpdated.propagate();
        }
        
        // Propagate module recursively when updated
        else if (compUpdated.type === 'MODULE') {
          // update input components to match state of input connectors              
          let inputComp = compUpdated.getInputComponent(connector);
          inputComp.setState(connector.getState());
          if (!activeModule) {
            me.propagate(false);
          }
        }

        // Update module outputs when updated
        else if (compUpdated.isOutputComp()) {
          let outputConn = me.getOutputConnector(compUpdated);
          outputConn.updateState(compUpdated.getState());
          compUpdated.stateChangedEvent();
        }
      }
    };

    // Run each input connector through an update iteration
    this.components.forEach(component => {
      component.getInputConnectors().forEach(connector => {
        updateConnections(connector);
      });
    });

    // Propagate all of this module's modules'
    this.components.forEach(component => {
      if (component.type === 'MODULE') {
        component.propagate(false);
      }
    });
  }

  /**
   * Update mappings for all output connectors (by ID) to their input connectors (object)
   */
  updateConnectorMap() {
    var me = this;
    this.connectorMap = {};
    this.components.forEach((component) =>  {
      component.getInputConnectors().forEach((connector) =>  {
        var connectorID = connector.getID();
        me.connectorMap[connectorID] = [];
        connector.getConnections().forEach((connFromID) =>  {
          var connFrom = me.getConnector(connFromID);
          if (connFrom !== null) {
            me.connectorMap[connectorID].push(connFrom);
          }
        });
      });
    });
  }
  
  /**
   * Retrieve an instance of the current connector mappings
   */
  getConnectorMap() {
    return this.connectorMap;
  }

  /**
   * Add a component to this module
   * 
   * @param {*} component The component being added
   */
  addComponent(component) {
    this.components.push(component);

    // If the component is an input, add input connector associated
    if (component.isInputComp()) {
      this.connectors.push(new Connector({ x: this.bounds.x, y: this.bounds.y }, 'INPUT'));
    }

    // If the component is an output, add output connector associated
    else if (component.isOutputComp()) {
      this.connectors.push(new Connector({ x: this.bounds.x, y: this.bounds.y }, 'OUTPUT'));
    }

    this.updateBounds();

    return component;
  }

  /**
   * Remove a component from this module
   * 
   * @param {*} component The component being removed
   */
  removeComponent(component) {
    let associatedConn = null;

    // If the component was an input, remove input connector associated
    if (component.isInputComp()) {
      associatedConn = this.getInputConnector(component);
    }

    // If the component was an output, remove the output connector associated
    else if (component.isOutputComp()) {
      associatedConn = this.getOutputConnector(component);
    }

    // Filter module's components to remove desired component
    this.components = this.components.filter(comp => comp !== component);
    this.connectors = this.connectors.filter(conn => conn !== associatedConn);

    // Filter module's components connector's to remove mapped connection
    this.components.forEach((comp) => {
      comp.getConnectors().forEach((conn) => {
        component.getConnectors().forEach((connector) => {
          conn.removeConnection(connector);
        });
      });
    });

    this.updateBounds();
  }

  /**
   * Retreive all Input-type components that are children of this module
   */
  getInputComponents() {
    let inputs = [];
    this.components.forEach((comp) => {
      if (comp.isInputComp()) {
        inputs.push(comp);
      }
    });
    return inputs;
  }

  /**
   * Retrieve all Output-type components that are children of this module
   */
  getOutputComponents() {
    let outputs = [];
    this.components.forEach((comp) => {
      if (comp.isOutputComp()) {
        outputs.push(comp);
      }
    });
    return outputs;
  }

  /**
   * Retrieve the input component from this module that is associated with this connector
   * 
   * @param {*} connector The connector associated with the input component
   */
  getInputComponent (connector) {
    let connIndex = this.getInputConnectors().indexOf(connector);
    return this.getInputComponents()[connIndex];
  }

  /**
   * Retrieve the output component from this module that is associated with this connector
   * 
   * @param {*} connector The connector associated with the output component
   */
  getOutputComponent (connector) {
    let connIndex = this.getOutputConnectors().indexOf(connector);
    return this.getOutputComponents()[connIndex];
  }

  /**
   * Retrieve the input connector instance associated with the desired component
   * 
   * @param {*} component The component associated with the desired connector
   */
  getInputConnector(component) {
    let result = null;

    if (component.isInputComp()) {
      let inputIndex = this.getInputComponents().indexOf(component);
      return this.getInputConnectors()[inputIndex];
    }

    return result;
  }

  /**
   * Retrieve the input connector instance associated with the desired component
   * 
   * @param {*} component The component associated with the desired connector
   */
  getOutputConnector(component) {
    let result = null;

    if (component.isOutputComp()) {
      let outputIndex = this.getOutputComponents().indexOf(component);
      return this.getOutputConnectors()[outputIndex];
    }

    return result;
  }

  /**
   * Retrieve a connector by it's associated UUID
   * 
   * @param {string} connID The associated connector ID
   */
  getConnector(connID) {
    let result = null;
    this.components.forEach((component) =>  {
      if (result !== null) return;
      component.getConnectors().forEach((connector) => {
        if (connector.getID() === connID) {
          result = connector;
          return;
        }
      });
    });
    return result;
  }

  /**
   * Retrieve an output connector instance by it's associated UUID
   * 
   * @param {string} connID The associated connector ID
   */
  getOutputConnectorFromID(connID) {
    let result = null;
    this.components.forEach((component) =>  {
      if (result !== null) return;
      component.getOutputConnectors().forEach((outConn) => {
        if (outConn.getID() === connID) {
          result = outConn;
          return;
        }
      });
    });
    return result;
  }
  
  /**
   * Retrieve an input connector instance by it's associated UUID
   * 
   * @param {string} connID The associated connector ID
   */
  getInputConnectorFromID(connID) {
    let result = null;
    this.components.forEach((component) =>  {
      if (result !== null) return;
      component.getInputConnectors().forEach((inConn) => {
        if (inConn.getID() === connID) {
          result = inConn;
          return;
        }
      });
    });
    return result;
  }

  /**
   * Retrieve an instance of a Component by one of it's connector instances
   * 
   * @param {Component} connector The connector associated with the Component
   */
  getComponent(connector) {
    let result = null;
    this.components.forEach((component) => {
      if (result !== null) return false;
      component.getConnectors().forEach((conn) => {
        if (connector.getID() === conn.getID()) {
          result = component;
          return false;
        }
      });
    });
    return result;
  }

  /**
   * Update the module bounds to properly fit all connectors
   *  After bounds are resized, update connectors positions to properly fit bounds
   */
  updateBounds() {
    let maxSideConns = (this.getInputConnectors().length < this.getOutputConnectors().length)
      ? this.getOutputConnectors().length
      : this.getInputConnectors().length;

    // Update width and height based on connector amount
    this.bounds = new createjs.Rectangle(
      this.bounds.x,
      this.bounds.y,
      EXTERNAL_WIDTH_DEFAULT,
      EXTERNAL_HEIGHT_DEFAULT * (maxSideConns + 1));

    let connPadding = 10;
    let me = this;

    // Update input connector locations
    this.getInputConnectors().forEach((conn) => {
      let gapLength = me.bounds.height / (me.getInputConnectors().length + 1);
      let index = me.getInputConnectors().indexOf(conn);
      conn.bounds.x = me.bounds.x - connPadding;
      conn.bounds.y = me.bounds.y + (gapLength * (index + 1));
    });

    // Update output connector locations
    this.getOutputConnectors().forEach((conn) => {
      let gapLength = me.bounds.height / (me.getOutputConnectors().length + 1);
      let index = me.getOutputConnectors().indexOf(conn);
      conn.bounds.x = me.bounds.x + me.bounds.width + connPadding;
      conn.bounds.y = me.bounds.y + (gapLength * (index + 1));
    });
  }

  /**
   * Paint the component
   * 
   * @param {createjs.Graphics} graphics The graphics object being painted to
   * @param {createjs.Point} screenPos The canvas location of the paint procedure
   */
  paint(graphics, screenPos) {
    let baseColor = 'rgba(0,0,0,0.8)';
    let me = this;

    graphics
      // Base Color fill
      .beginFill(baseColor)

      // Outline Stroke
      .beginStroke('rgb(0,0,0)')
      .setStrokeStyle(2)
      .drawRect(screenPos.x, screenPos.y, this.bounds.width, this.bounds.height)
      .endStroke()
      .endFill()
      .setStrokeStyle();

    // Draw input connectors
    this.getInputConnectors().forEach((conn) => {
      let xDiff = me.bounds.x - conn.bounds.x;
      let yDiff = conn.bounds.y - me.bounds.y;
      graphics
        .beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .moveTo(screenPos.x - xDiff, screenPos.y + yDiff)
        .lineTo(screenPos.x, screenPos.y + yDiff)
        .endStroke()
        .setStrokeStyle();
    });

    // Draw output connectors
    this.getOutputConnectors().forEach((conn) => {
      let xDiff = conn.bounds.x - me.bounds.x;
      let yDiff = conn.bounds.y - me.bounds.y;
      graphics
        .beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .moveTo((screenPos.x + me.bounds.width), screenPos.y + yDiff)
        .lineTo(screenPos.x + xDiff, screenPos.y + yDiff)
        .endStroke()
        .setStrokeStyle();
    });
  }
}