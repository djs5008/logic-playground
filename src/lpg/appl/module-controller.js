// MISC
import { Connector } from '../model/types/misc/connector';
import { Module } from '../model/types/misc/module';

// GATES
import { ANDGate } from '../model/types/gates/and-gate';
import { NANDGate } from '../model/types/gates/nand-gate';
import { ORGate } from '../model/types/gates/or-gate';
import { NORGate } from '../model/types/gates/nor-gate';
import { XORGate } from '../model/types/gates/xor-gate';
import { XNORGate } from '../model/types/gates/xnor-gate';
import { NOTGate } from '../model/types/gates/not-gate';

// INPUTS
import { SwitchButton } from '../model/types/inputs/switch-button';
import { HoldButton } from '../model/types/inputs/hold-button';
import { Clock } from '../model/types/inputs/clock';

// OUTPUTS
import { LED } from '../model/types/outputs/led';
import { SevenSegDisp } from '../model/types/outputs/seven-seg-disp';
import { Console } from '../model/types/outputs/console';

import uuidv4 from 'uuid/v4';

import { store } from '../../store/store.js';
import { setActiveModule } from '../../actions/actions.js';

// 
// Constants
// 
const LOGIC_INTERVAL_MS = 1;

export class ModuleController {

  /**
   * ModuleController constructor
   */
  constructor(resourceController) {
    this.resourceController = resourceController;
  }

  /**
   * Retrieve the current instance of the activeModule from our redux store
   */
  getActiveModule() {
    return store.getState().activeModules[0];
  }

  /**
   * Retrieve the current stack of activeModules from our redux store
   */
  getActiveModules() {
    return store.getState().activeModules;
  }

  /**
   * Initialize the flow of logic
   *  This is the base of all bit-flow transactions
   */
  startLogicTimer() {
    let me = this;

    // Start simulating the logic flow
    setInterval(() =>  {
      if (me.getActiveModule() !== undefined) {
        me.getActiveModule().propagate(true);
      }
    }, LOGIC_INTERVAL_MS);
  }

  /**
   * Establish a new activeModule (used by selection & draw controllers)
   */
  newModule() {
    this.setActiveModule(new Module(new window.createjs.Rectangle(0, 0)));
  }

  /**
   * Set the active module
   */
  setActiveModule(activeModule) {
    store.dispatch(setActiveModule(activeModule));
    this.getActiveModule().updateConnectorMap();
  }

  /**
   * Load a module by copying old modules (and it's components) attributes to newly created one
   * 
   * @param {Module} mod The json-parsed module object (prototypes not assigned) 
   */
  loadModule(mod) {
    let loadedModule = new Module(new window.createjs.Rectangle(0, 0));
    let me = this;

    let loadConnector = (conn) => {
      let loadedConnector = new Connector(conn.bounds, conn.type);

      // Copy connectors attributes to new connector  
      for (var attr in conn) loadedConnector[attr] = conn[attr];
      
      // Copy bounds into new rectangle instance
      loadedConnector.bounds = new window.createjs.Rectangle(conn.bounds.x, conn.bounds.y, conn.bounds.width, conn.bounds.height);

      return loadedConnector;
    };

    let loadComponent = (comp) => {
      let loadedComponent = null;

      if (comp.type === 'MODULE') {
        // Recursively load this component as a module
        loadedComponent = me.loadModule(comp);
      } else {
        loadedComponent = me.createComponent(comp.type, comp.bounds);

        // Copy components attributes to new component
        for (var attr in comp) loadedComponent[attr] = comp[attr];
      }

      // Copy bounds into new rectangle instance
      loadedComponent.bounds = new window.createjs.Rectangle(comp.bounds.x, comp.bounds.y, comp.bounds.width, comp.bounds.height);

      // Clear copied connectors and re-push newly instantiated ones
      loadedComponent.connectors = [];
      comp.connectors.forEach((conn) => loadedComponent.connectors.push(loadConnector(conn)));

      return loadedComponent;
    };

    // Copy old modules attributes to new module
    for (var attr in mod) loadedModule[attr] = mod[attr];

    // Overwrite bounds with new Rectangle instance
    loadedModule.bounds = new window.createjs.Rectangle(mod.bounds.x, mod.bounds.y, mod.bounds.width, mod.bounds.height);

    // Load connectors for this module
    // Clear copied connectors and re-push newly instantiated ones
    loadedModule.connectors = [];
    mod.connectors.forEach((conn) => loadedModule.connectors.push(loadConnector(conn)));

    // Clear copied components and re-push newly instantiated ones
    loadedModule.components = [];
    mod.components.forEach((comp) => loadedModule.components.push(loadComponent(comp)));

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
      case 'AND-GATE': return new ANDGate(args, this.resourceController.getResource('and-gate'));
      case 'NAND-GATE': return new NANDGate(args, this.resourceController.getResource('nand-gate'));
      case 'OR-GATE': return new ORGate(args, this.resourceController.getResource('or-gate'));
      case 'NOR-GATE': return new NORGate(args, this.resourceController.getResource('nor-gate'));
      case 'XOR-GATE': return new XORGate(args, this.resourceController.getResource('xor-gate'));
      case 'XNOR-GATE': return new XNORGate(args, this.resourceController.getResource('xnor-gate'));
      case 'NOT-GATE': return new NOTGate(args, this.resourceController.getResource('not-gate'));
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
   * @param {Module} mod The pre-parsed module object
   */
  importModule(mod, bounds) {
    this.refreshConnectors(mod);
    this.getActiveModule().addComponent(mod);
    mod.bounds = bounds;
    mod.updateBounds();
    mod.propagate();
    this.getActiveModule().updateConnectorMap();
    return mod;
  }

  /**
   * Re-load component connector IDs to new UUIDs
   * 
   * @param {*} component The component being refreshed
   */
  refreshConnectors(component) {
    component.connectors.forEach((conn) => {
      conn.id = uuidv4();
    });
    this.getActiveModule().updateConnectorMap();
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
      return this.getActiveModule().addComponent(comp);
    }

    this.getActiveModule().updateConnectorMap();

    return null;
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
    if (connector.isInput()) {
      connector.connections.forEach((connectionID) =>  {
        var connFrom = me.getActiveModule().getConnector(connectionID);
        connector.removeConnection(connFrom);
      });
    }

    // Find all of input's output connectors and remove input from it
    else {
      me.getActiveModule().components.forEach((component) =>  {
        component.connectors.forEach((conn) =>  {
          if (conn.isInput()) {
            conn.connections.forEach((connID) =>  {
              if (connID === connector.getID()) {
                conn.removeConnection(me.getActiveModule().getConnector(connector.getID()));
              }
            });
          }
        });
      });
    }

    this.getActiveModule().updateConnectorMap();
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

    mod.updateConnectorMap();
  }
}