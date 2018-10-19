import React from 'react';
import { addGateType, addInputType, addOutputType, addImport } from '../../actions/actions.js';
import { store } from '../../store/store.js';

export class UIController {

  /**
   * Construct UI Controller
   * 
   * @param {*} moduleController Instance of ModuleController
   * @param {*} selectionController Instance of SelectionController
   * @param {*} fileController Instance of FileController
   */
  constructor(moduleController, selectionController, fileController) {
    this.moduleController = moduleController;
    this.selectionController = selectionController;
    this.fileController = fileController;
    this.visibleImports = [];
  }

  /**
   * Initalize drag-n-drop functionality from component pool to stage
   */
  setupDragNDropHandler() {
    let me = this;
    let canvas = document.getElementById('logic-canvas');

    canvas.addEventListener('dragover', (evt) => evt.preventDefault());
    canvas.addEventListener('drop', (evt) => {
      evt.preventDefault();
      let data = evt.dataTransfer.getData('text/x-component');
      let rect = canvas.getBoundingClientRect();
      let dragX = evt.clientX - (rect.left + window.scrollX);
      let dragY = evt.clientY - (rect.top + window.scrollY);
      let loc = me.selectionController.getRealCoords({ x: dragX, y: dragY });
      let bounds = new window.createjs.Rectangle(loc.x, loc.y, 0, 0);
      let component;

      // imported modules
      if (data.includes('imported_')) {
        let name = data.replace('imported_', '');
        component = me.moduleController.importModule(me.getImportedModule(name), bounds);
      } 
      
      // default components
      else {
        component = me.moduleController.addComponent(data, bounds);
      }

      if (component !== null) {
        // shift component to place at center of cursor
        component.move(
          -(component.bounds.width / 2),
          -(component.bounds.height / 2)
        );
      }
    });
  }

  /**
   * Initialize Module-Controls functionality
   */
  setupModuleControlHandlers() {
    let me = this;

    window.$('#module-back-button').click((event) => {
      event.preventDefault();

      // Check if activeModules list is empty
      if (me.moduleController.getActiveModules().length > 0) {
        let topModule = me.moduleController.getActiveModules().pop();

        // Set active module
        me.moduleController.setActiveModule(topModule);

        // Check stack size again after popping
        if (me.moduleController.getActiveModules().length === 0) {
          // Set module back button visibility
          window.$('#module-back-button').css('visibility', 'hidden');
        }

        me.selectionController.clearSelection();
      }
    });
  }

  /**
   * Initialize all default component types in their respective component pools
   */
  loadDefaultComponents() {
    // Load gates
    let tmpGates = [];
    tmpGates.push(this.moduleController.createComponent('and-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('nand-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('or-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('nor-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('xor-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('xnor-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('not-gate', { x: 0, y: 0 }));

    // Load inputs
    let tmpInputs = [];
    tmpInputs.push(this.moduleController.createComponent('switch-button', { x: 0, y: 0 }));
    tmpInputs.push(this.moduleController.createComponent('hold-button', { x: 0, y: 0 }));
    tmpInputs.push(this.moduleController.createComponent('clock', { x: 0, y: 0 }));

    // Load outputs
    let tmpOutputs = [];
    tmpOutputs.push(this.moduleController.createComponent('led', { x: 0, y: 0 }));
    tmpOutputs.push(this.moduleController.createComponent('seven-seg-disp', { x: 0, y: 0 }));
    tmpOutputs.push(this.moduleController.createComponent('console', { x: 0, y: 0 }));

    const loadItemHTML = (comp) => {
      const addDragData = (event) => {
        event.dataTransfer.setData('text/x-component', event.target.id);
      };
      let id = comp.type;  
      let url = comp.exportImage();
      let label = comp.type.replace('-GATE', '').replace('-BUTTON', '');
      let noSelect = {
        '-webkit-touch-callout':  'none', /* iOS Safari */
        '-webkit-user-select':    'none', /* Safari */
        '-khtml-user-select':     'none', /* Konqueror HTML */
        '-moz-user-select':       'none', /* Firefox */
        '-ms-user-select':        'none', /* Internet Explorer/Edge */
        'user-select':            'none', /* Non-prefixed version, currently
                                              supported by Chrome and Opera */
      }
      let divStyle = {
        margin: 5,
        padding: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        ...noSelect,
      };
      let labelStyle = {
        margin: 0,
        ...noSelect,
      };
      let compItemHTML = (
        <div key={id} style={divStyle}
            className='drag-item' onDragStart={(event) => addDragData(event)}>
          <img id={id} src={url} draggable="true" width='100%' alt=""/>
          <h6 style={labelStyle}>{label.replace(/-/g, ' ')}</h6>
        </div>
      );
    
      return compItemHTML;
    };
    
        // load into correct containers
    tmpGates.forEach((gate) => store.dispatch(addGateType(loadItemHTML(gate))));
    tmpInputs.forEach((input) => store.dispatch(addInputType(loadItemHTML(input))));
    tmpOutputs.forEach((output) => store.dispatch(addOutputType(loadItemHTML(output))));
  }

  /**
   * Load an imported module into the UI
   * 
   * @param {*} importedModule The Module instance beign loaded
   */
  loadImportedModule(importedModule) {
    const loadItemHTML = (comp) => {
      const addDragData = (event) => {
        event.dataTransfer.setData('text/x-component', event.target.id);
      };
      let id = comp.label;
      let url = comp.exportImage();
      let label = comp.label;
      let compItemHTML = (
        <div key={id} style={{ 'padding': '5px' }} className='drag-item' onDragStart={ (event) => addDragData(event) }>
          <img id={id} src={url} draggable width="70" alt=""/>
          <h6>{label}</h6>
        </div>
      );
      return compItemHTML;
    };
    
    store.dispatch(addImport(loadItemHTML(importedModule)));
  }

  /**
   * Initialize document-wide key-listening for application
   */
  setupKeyListeners() {
    let me = this;

    document.addEventListener('keydown', (evt) => {
      const DELETE_KEY = 46;

      switch (evt.keyCode) {
        case DELETE_KEY:
          me.selectionController.selectedComponents.forEach((comp) => {
            me.moduleController.deleteComponent(me.moduleController.getActiveModule(), comp);
          });
          me.selectionController.clearSelection();
          break;
        default: break;
      }
    });
  }

  /**
   * Retrieve an imported module from sessionStorage that has the current name
   * 
   * @param {*} name The module's label being used to retrieve the module instance
   */
  getImportedModule(name) {
    let me = this;
    let result = null;
    JSON.parse(sessionStorage.importedModules).forEach((importedModule) => {
      if (result !== null) return false;
      let mod = JSON.parse(importedModule);
      if (mod.label === name) {
        result = me.moduleController.loadModule(mod);
        return false;
      }
    });
    return result;
  }

  /**
   * Initialize check for un-shown imported modules
   */
  checkImports() {
    let me = this;
    setInterval(() => {
      if (sessionStorage.importedModules !== undefined) {
        JSON.parse(sessionStorage.importedModules).forEach((importedModule) => {
          if (!me.visibleImports.includes(importedModule)) {
            // load module to module object
            let mod = me.moduleController.loadModule(JSON.parse(importedModule));
            
            // add item to ui
            me.loadImportedModule(mod);

            // add to visibleImports
            me.visibleImports.push(importedModule);
          }
        });
      }
    }, 250);
  }
}