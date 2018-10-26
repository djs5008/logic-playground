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
   * @param {Component} comp The component being loaded
   * @param {string} label OPTIONAL label being applied to loaded item
   * @param {string} src OPTIONAL source for image being loaded
   * @param {function} onload OPTIONAL function for handling image being loaded
   */
  loadItemHTML(comp, label, src, onload) {
    let id = comp.type;  
    let url = src || comp.exportImage();
    let lbl = label || comp.type.replace('-GATE', '').replace('-BUTTON', '');
    return (<DragComponent key={id} id={id} src={url} label={lbl} onLoad={onload} />);
  }

  /**
   * Initialize all default component types in their respective component pools
   */
  loadDefaultComponents() {
    let bounds = () => {
      return { bounds: { x: 0, y: 0 } };
    }

    // Load gates
    const gateImages = {
      'and-gate': '/img/lpg/and-gate.png',
      'nand-gate': '/img/lpg/nand-gate.png',
      'nor-gate': '/img/lpg/nor-gate.png',
      'not-gate': '/img/lpg/not-gate.png',
      'or-gate': '/img/lpg/or-gate.png',
      'xnor-gate': '/img/lpg/xnor-gate.png',
      'xor-gate': '/img/lpg/xor-gate.png',
    };
    
    Object.keys(gateImages).forEach(gateType => {
      let gate = this.moduleController.createComponent(gateType, bounds());
      const imageLoaded = (img) => {
        gate.setImage(img);
        gate.setupGate();
      };
      store.dispatch(addGateType(this.loadItemHTML(gate, null, gateImages[gateType], imageLoaded)));
    });

    // Load inputs
    let tmpInputs = [];
    tmpInputs.push(this.moduleController.createComponent('switch-button', bounds()));
    tmpInputs.push(this.moduleController.createComponent('hold-button', bounds()));
    tmpInputs.push(this.moduleController.createComponent('clock', bounds()));

    // Load outputs
    let tmpOutputs = [];
    tmpOutputs.push(this.moduleController.createComponent('led', bounds()));
    tmpOutputs.push(this.moduleController.createComponent('seven-seg-disp', bounds()));
    tmpOutputs.push(this.moduleController.createComponent('console', bounds()));
    
    // load into correct containers
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