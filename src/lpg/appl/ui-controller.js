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
    var me = this;
    let canvas = document.getElementById('logic-canvas');

    canvas.addEventListener('dragover', (evt) => evt.preventDefault());
    canvas.addEventListener('drop', (evt) => {
        evt.preventDefault();
        var data = evt.dataTransfer.getData('text/x-component');
        var dragX = evt.clientX - canvas.offsetLeft;
        var dragY = evt.clientY - canvas.offsetTop;
        var loc = me.selectionController.getRealCoords({ x: dragX, y: dragY });
        var bounds = new window.createjs.Rectangle(loc.x, loc.y, 0, 0);
        var component;

        // imported modules
        if (data.includes('imported_')) {
          var name = data.replace('imported_', '');
          component = me.moduleController.importModule(me.getImportedModule(name), bounds);
        } 
        
        // default components
        else {
          component = me.moduleController.addComponent(data, bounds);
        }

        if (component !== null) {
          // shift component to place at center of cursor
          component.moveTo(
            component.bounds.x - (component.bounds.width / 2),
            component.bounds.y - (component.bounds.height / 2)
          );
        }
      });
  }

  /**
   * Initialize Module-Controls functionality
   */
  setupModuleControlHandlers() {
    var me = this;

    window.$('#controls-new').click(() => {
      if (window.confirm('Are you sure? You will lose anything not saved!')) {
        me.moduleController.newModule();
        window.$('#module-name').val(me.moduleController.activeModule.label);
      }
    });

    window.$('#controls-save').click(() => me.fileController.saveActiveModule());

    window.$('#controls-export').click(() => me.fileController.exportActiveModule());

    window.$('#controls-load').click(() => me.fileController.loadModuleFile(me.fileController.loadModule));

    window.$('#controls-import').click(() => me.fileController.loadModuleFile(me.fileController.importModule));

    window.$('#module-name').on('input propertychange paste', () => {
      me.moduleController.activeModule.label = window.$('#module-name').val();
    });

    window.$('#module-back-button').click((event) => {
      event.preventDefault();

      // Check if activeModules list is empty
      if (me.moduleController.activeModules.length > 0) {
        var topModule = me.moduleController.activeModules.pop();

        // Set active module
        me.moduleController.setActiveModule(topModule);

        // Check stack size again after popping
        if (me.moduleController.activeModules.length === 0) {
          // Set module back button visibility
          window.$('#module-back-button').css('visibility', 'hidden');
        }

        window.$('#module-name').val(me.moduleController.activeModule.label);

        me.selectionController.clearSelection();
      }
    });
  }

  /**
   * Initialize all default component types in their respective component pools
   */
  loadDefaultComponents() {
    // Load gates
    var tmpGates = [];
    tmpGates.push(this.moduleController.createComponent('and-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('nand-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('or-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('nor-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('xor-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('xnor-gate', { x: 0, y: 0 }));
    tmpGates.push(this.moduleController.createComponent('not-gate', { x: 0, y: 0 }));

    // Load inputs
    var tmpInputs = [];
    tmpInputs.push(this.moduleController.createComponent('switch-button', { x: 0, y: 0 }));
    tmpInputs.push(this.moduleController.createComponent('hold-button', { x: 0, y: 0 }));
    tmpInputs.push(this.moduleController.createComponent('clock', { x: 0, y: 0 }));

    // Load outputs
    var tmpOutputs = [];
    tmpOutputs.push(this.moduleController.createComponent('led', { x: 0, y: 0 }));
    tmpOutputs.push(this.moduleController.createComponent('seven-seg-disp', { x: 0, y: 0 }));
    tmpOutputs.push(this.moduleController.createComponent('console', { x: 0, y: 0 }));

    var loadItemHTML = (comp) => {
      const addDragData = (event) => {
        event.dataTransfer.setData('text/x-component', event.target.id);
      };
      var id = comp.type;  
      var url = comp.exportImage();
      var label = comp.type.replace('-GATE', '').replace('-BUTTON', '');
      var compItemHTML = (
        <div key={id} style={{ padding: 5, userSelect: 'none', }}
            className='drag-item' onDragStart={(event) => addDragData(event)}>
          <img id={id} src={url} draggable="true" width="70" alt=""/>
          <h6 style={{ 'margin': '0px', userSelect: 'none' }}>{label}</h6>
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
    var loadItemHTML = (comp) => {
      const addDragData = (event) => {
        event.dataTransfer.setData('text/x-component', event.target.id);
      };
      var id = comp.label;
      var url = comp.exportImage();
      var label = comp.label;
      var compItemHTML = (
        <div key={id} style={{ 'padding': '5px' }} className='drag-item' onDragStart={ (event) => addDragData(event) }>
          <img id={id} src={url} draggable width="70" alt=""/>
          <h6>{label}</h6>
        </div>
      );
      return compItemHTML;
    };
    
    var html = loadItemHTML(importedModule);
    store.dispatch(addImport(html));
  }

  /**
   * Initialize document-wide key-listening for application
   */
  setupKeyListeners() {
    var me = this;

    document.addEventListener('keydown', (evt) => {
      const DELETE_KEY = 46;

      switch (evt.keyCode) {
        case DELETE_KEY:
          me.selectionController.selectedComponents.forEach((comp) => {
            me.moduleController.deleteComponent(me.moduleController.activeModule, comp);
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
    var me = this;
    var result = null;
    JSON.parse(sessionStorage.importedModules).forEach((importedModule) => {
      if (result !== null) return false;
      var mod = JSON.parse(importedModule);
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
    var me = this;
    setInterval(() => {
      if (sessionStorage.importedModules !== undefined) {
        JSON.parse(sessionStorage.importedModules).forEach((importedModule) => {
          if (!me.visibleImports.includes(importedModule)) {
            // load module to module object
            var mod = me.moduleController.loadModule(JSON.parse(importedModule));
            
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