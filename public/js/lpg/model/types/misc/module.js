/* global createjs */
define(function (require) {
  'use strict';

  // 
  // Includes
  // 
  var Connector = require('model/types/misc/connector');
  var Gate = require('model/types/gate');

  // 
  // Constants
  // 
  const DEFAULT_LABEL = 'unnamed';
  const EXTERNAL_WIDTH_DEFAULT = 40;
  const EXTERNAL_HEIGHT_DEFAULT = 20;

  class Module extends Gate {

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
      this.updateBounds();
      this.propagate();
    }

    /**
     * Override propagate functionality
     */
    propagate(activeModule) {
      let me = this;
      let updated = false;

      // Update all outputs => inputs
      //    Update in order of off => off then on => on
      //    This makes the on state preferred
      let updateConnections = function(connector) {
        connector.getConnections().forEach(connToID => {
          let connTo = me.getConnector(connToID);

          // update state if input state !== output state
          if (connTo.getState() !== connector.getState()) {

            // Prefer the on state
            if (!connector.getState() && isPoweredElsewhere(connTo)) {
              return;
            }
          
            connTo.updateState(connector.getState());

            // propagate gate if it was a gate that was updated
            let compUpdated = me.getComponent(connTo);
            if (compUpdated.isGate()) {
              compUpdated.propagate();
            }

            updated = true;
          }
        });
      };

      // Check if a state is being powered from another source
      //    This is used to ensure that an off => on state does not
      //    turn a state off when it's already being turned on elsewhere
      let isPoweredElsewhere = function(connector) {
        let result = false;
        me.components.forEach((component) => {
          component.getConnectors().forEach((conn) => {
            conn.getConnections().forEach((connToID) => {
              if (result) return;
              let connTo = me.getConnector(connToID);
              if (connector === connTo && conn.getState()) {
                result = true;
              }
            });
          });
        });
        return result;
      };

      // off => off
      this.components.forEach(component => {
        component.getOutputConnectors().forEach(connector => {
          if (!connector.getState()) {
            updateConnections(connector);
          }
        });
      });

      // on => on
      this.components.forEach(component => {
        component.getOutputConnectors().forEach(connector => {
          if (connector.getState()) {
            updateConnections(connector);
          }
        });
      });
      
      // Propagate embedded modules
      this.components.forEach(component => {
        if (component.type === 'MODULE') {
          component.propagate(false);
        }
      });


      if (!activeModule) {
        
        // Propagate embedded modules recursively
        if (updated) {
          this.propagate(false);
        }

        // Update input components to match input connector states
        // Do not update if the current module is the active module
        this.getInputComponents().forEach(inputComp => {
          let inputConn = me.getInputConnector(inputComp);
          if (inputConn.getState() !== inputComp.getState()) {
            inputComp.setState(inputConn.getState());
          }
        });
      }

      // Update output connectors to match state of output components
      this.getOutputConnectors().forEach(outputConn => {
        let outputComp = me.getOutputComponent(outputConn);
        if (outputComp.getState() !== outputConn.getState()) {
          outputConn.updateState(outputComp.getState());

          // log console updates
          if (outputComp.type === 'CONSOLE') {
            console.log(outputComp.label + ': ' + outputComp.getState());
          }
        }
      });

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
      this.components.forEach(function (component) {
        if (result !== null) return false;
        component.getConnectors().forEach((connector) => {
          if (connector.getID() === connID) {
            result = connector;
            return false;
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
        if (result != null) return false;
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

  return Module;
});