import React from 'react';
import { addGateType, addInputType, addOutputType, addImport } from '../../actions/actions.js';
import { store } from '../../store/store.js';
import DragComponent from '../../components/drag-component.jsx';

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
   * Load a component into HTML for rendering
   * @param {Component} comp 
   */
  loadItemHTML(comp, label) {
    let id = comp.type;  
    let url = comp.exportImage();
    let lbl = label || comp.type.replace('-GATE', '').replace('-BUTTON', '');
    return (<DragComponent id={id} src={url} label={lbl} />);
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
    
    // load into correct containers
    tmpGates.forEach((gate) => store.dispatch(addGateType(this.loadItemHTML(gate))));
    tmpInputs.forEach((input) => store.dispatch(addInputType(this.loadItemHTML(input))));
    tmpOutputs.forEach((output) => store.dispatch(addOutputType(this.loadItemHTML(output))));
  }

  /**
   * Load an imported module into the UI
   * 
   * @param {*} importedModule The Module instance beign loaded
   */
  loadImportedModule(importedModule) {
    store.dispatch(addImport(this.loadItemHTML(importedModule, importedModule.label)));
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