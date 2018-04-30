/* global createjs,uuid */
define((require) => {
  'use strict';

  // MISC
  var Connector = require('model/types/misc/connector');
  var Module = require('model/types/misc/module');

  // GATES
  var ANDGate = require('model/types/gates/and-gate');
  var NANDGate = require('model/types/gates/nand-gate');
  var ORGate = require('model/types/gates/or-gate');
  var NORGate = require('model/types/gates/nor-gate');
  var XORGate = require('model/types/gates/xor-gate');
  var XNORGate = require('model/types/gates/xnor-gate');
  var NOTGate = require('model/types/gates/not-gate');

  // INPUTS
  var SwitchButton = require('model/types/inputs/switch-button');
  var HoldButton = require('model/types/inputs/hold-button');
  var Clock = require('model/types/inputs/clock');

  // OUTPUTS
  var LED = require('model/types/outputs/led');
  var SevenSegDisp = require('model/types/outputs/seven-seg-disp');
  var Console = require('model/types/outputs/console');

  // 
  // Constants
  // 
  const LOGIC_INTERVAL_MS = 25;

  class ModuleController {

    /**
     * ModuleController constructor
     */
    constructor() {
      this.activeModule = undefined;
      this.activeModules = [];
    }

    /**
     * Initialize the flow of logic
     *  This is the base of all bit-flow transactions
     */
    startLogicTimer() {
      var me = this;

      // Start simulating the logic flow
      setInterval(() =>  {
        if (me.activeModule !== undefined) {
          me.activeModule.propagate(true);
        }
      }, LOGIC_INTERVAL_MS);
    }

    /**
     * Establish a new activeModule (used by selection & draw controllers)
     */
    newModule() {
      this.activeModule = new Module(new createjs.Rectangle(0, 0));
    }

    /**
     * Load a module by copying old modules (and it's components) attributes to newly created one
     * 
     * @param {*} mod The json-parsed module object (prototypes not assigned) 
     */
    loadModule(mod) {
      var loadedModule = new Module(new createjs.Rectangle(0, 0));
      var me = this;

      function loadConnector(conn) {
        var loadedConnector = new Connector(conn.bounds, conn.type);

        // Copy connectors attributes to new connector  
        for (var attr in conn) loadedConnector[attr] = conn[attr];

        // Copy bounds into new rectangle instance
        loadedConnector.bounds = new createjs.Rectangle(conn.bounds.x, conn.bounds.y, conn.bounds.width, conn.bounds.height);

        return loadedConnector;
      }

      function loadComponent(comp) {
        var loadedComponent = me.createComponent(comp.type, comp.bounds);

        if (comp.type === 'MODULE') {
          // Recursively load this component as a module
          loadedComponent = me.loadModule(comp);
          loadedComponent.updateBounds();
        } else {
          // Copy components attributes to new component
          for (var attr in comp) loadedComponent[attr] = comp[attr];
        }

        // Copy bounds into new rectangle instance
        loadedComponent.bounds = new createjs.Rectangle(comp.bounds.x, comp.bounds.y, comp.bounds.width, comp.bounds.height);

        // Clear copied connectors and re-push newly instantiated ones
        loadedComponent.connectors = [];
        comp.connectors.forEach((conn) =>  {
          loadedComponent.connectors.push(loadConnector(conn));
        });

        return loadedComponent;
      }

      // Copy old modules attributes to new module
      for (var attr in mod) loadedModule[attr] = mod[attr];

      // Load connectors for this module
      // Clear copied connectors and re-push newly instantiated ones
      loadedModule.connectors = [];
      mod.connectors.forEach((conn) =>  {
        loadedModule.connectors.push(loadConnector(conn));
      });

      // Overwrite bounds with new Rectangle instance
      loadedModule.bounds = new createjs.Rectangle(mod.bounds.x, mod.bounds.y, mod.bounds.width, mod.bounds.height);

      // Clear copied components and re-push newly instantiated ones
      loadedModule.components = [];
      mod.components.forEach((comp) =>  {
        loadedModule.components.push(loadComponent(comp));
      });

      loadedModule.updateBounds();

      return loadedModule;
    }

    /**
     * Instantiate a component based on a privided (string) type
     * 
     * @param {string} type The type of component being instantiated
     * @param {*} args The arguments provided to the component creation
     */
    createComponent(type, args) {
      switch (type.toUpperCase()) {
        case 'CONNECTOR': return new Connector(args);
        case 'MODULE': return new Module(args);
        case 'AND-GATE': return new ANDGate(args);
        case 'NAND-GATE': return new NANDGate(args);
        case 'OR-GATE': return new ORGate(args);
        case 'NOR-GATE': return new NORGate(args);
        case 'XOR-GATE': return new XORGate(args);
        case 'XNOR-GATE': return new XNORGate(args);
        case 'NOT-GATE': return new NOTGate(args);
        case 'HOLD-BUTTON': return new HoldButton(args);
        case 'SWITCH-BUTTON': return new SwitchButton(args);
        case 'CLOCK': return new Clock(args);
        case 'LED': return new LED(args);
        case 'SEVEN-SEG-DISP': return new SevenSegDisp(args);
        case 'CONSOLE': return new Console(args);
        default:
          alert('Invalid component type: "' + type + '"');
          return null;
      }
    }

    /**
     * Load a module from your "imported modules" area
     *  This will load the module and add it as a component in the active module
     * 
     * @param {*} mod The pre-parsed module object
     */
    importModule(mod, bounds) {
      this.refreshConnectors(mod);
      this.activeModule.addComponent(mod);
      mod.bounds = bounds;
      mod.updateBounds();
      mod.propagate();
      return mod;
    }

    /**
     * Re-load component connector IDs to new UUIDs
     * 
     * @param {*} component The component being refreshed
     */
    refreshConnectors(component) {
      component.connectors.forEach((conn) => {
        conn.id = uuid();
      });
    }

    /**
     * Add a component to the activeModule
     * 
     * @param {string} type Type component type being added to the activeModule
     * @param {createjs.Point} bounds The real-bounds of the component to be added to the activeModule
     */
    addComponent(type, bounds) {
      var comp = this.createComponent(type, bounds);

      if (comp !== null) {
        return this.activeModule.addComponent(comp);
      }

      return null;
    }

    /**
     * Retrieve an object that maps all output connectors (by ID) to their input connectors (object)
     */
    getConnectorMap() {
      var me = this;
      var map = {};
      this.activeModule.components.forEach((component) =>  {
        component.getConnectors().forEach((connector) =>  {
          if (connector.isOutput()) {
            var connectorID = connector.getID();
            map[connectorID] = [];
            connector.getConnections().forEach((connTo) =>  {
              var conn = me.activeModule.getConnector(connTo);
              if (conn !== null) {
                map[connectorID].push(conn);
              }
            });
          }
        });
      });
      return map;
    }

    /**
     * Break a connector (disassociate it's connections map)
     *  This will also set all connectors it was associated to default (off) value
     *  If the connector is supposed to be on, it will get picked up by the logic clock
     * 
     * @param {*} connector The connector being broken on
     */
    breakConnections(connector) {
      var me = this;
      // Break all of output's connections
      if (connector.isOutput()) {
        connector.connections.forEach((connectionID) =>  {
          var connTo = me.activeModule.getConnector(connectionID);
          connector.removeConnection(connTo);
          connTo.updateState(false);

          var compTo = me.activeModule.getComponent(connTo);
          if (compTo.isGate()) {
            compTo.propagate();
          }
        });
      }

      // Find all of input's output connectors and remove input from it
      else {
        me.activeModule.components.forEach((component) =>  {
          component.connectors.forEach((conn) =>  {
            if (conn.isOutput()) {
              conn.connections.forEach((connID) =>  {
                if (connID === connector.getID()) {
                  conn.removeConnection(me.activeModule.getConnector(connector.getID()));
                }
              });
            }
          });
        });
      }

      connector.updateState(false);
      var comp = me.activeModule.getComponent(connector);
      if (comp.isGate()) {
        comp.propagate();
      }
    }

    /**
     * Remove a component from the activeModule
     *  This will automatically break desired component's connectors
     * 
     * @param {*} mod The module the component is being deleted from
     * @param {*} component The component being deleted
     */
    deleteComponent(mod, component) {
      var me = this;

      // Break all connectors leading to this component
      component.connectors.forEach((connector) =>  {
        me.breakConnections(connector);
      });

      mod.removeComponent(component);
    }
  }

  return ModuleController;
});