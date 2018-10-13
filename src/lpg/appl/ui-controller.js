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

    window.$('#logic-canvas')
      .on('dragover', (event) => event.preventDefault())
      .on('drop', (event) => {
        event.preventDefault();
        var data = event.originalEvent.dataTransfer.getData('text/x-component');
        var dragX = event.clientX - window.$('#logic-canvas').offset().left;
        var dragY = event.clientY - window.$('#logic-canvas').offset().top;
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
   * Initialize DragNDrop listeners
   */
  addDragListeners() {
    window.$('.drag-item').on('dragstart', (event) => {
      event.originalEvent.dataTransfer.setData('text/x-component', event.target.id);
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
   * Initialize Component-pool controls functionality
   */
  setupPoolControlHandlers() {

    // Handle component-type buttons
    window.$('#pool-gates').click(() => {
      window.$('#component-menu').css('visibility', 'hidden');
      window.$('#gate-pool').css('visibility', 'visible');
    });

    window.$('#pool-inputs').click(() => {
      window.$('#component-menu').css('visibility', 'hidden');
      window.$('#input-pool').css('visibility', 'visible');
    });

    window.$('#pool-outputs').click(() => {
      window.$('#component-menu').css('visibility', 'hidden');
      window.$('#output-pool').css('visibility', 'visible');
    });

    window.$('#pool-imports').click(() => {
      window.$('#component-menu').css('visibility', 'hidden');
      window.$('#import-pool').css('visibility', 'visible');
    });

    // Handle back buttons
    window.$('#gate-pool-back').click(() => {
      window.$('#gate-pool').css('visibility', 'hidden');
      window.$('#component-menu').css('visibility', 'visible');
    });

    window.$('#input-pool-back').click(() => {
      window.$('#input-pool').css('visibility', 'hidden');
      window.$('#component-menu').css('visibility', 'visible');
    });

    window.$('#output-pool-back').click(() => {
      window.$('#output-pool').css('visibility', 'hidden');
      window.$('#component-menu').css('visibility', 'visible');
    });

    window.$('#import-pool-back').click(() => {
      window.$('#import-pool').css('visibility', 'hidden');
      window.$('#component-menu').css('visibility', 'visible');
    });
  }

  /**
   * Initialize all default component types in their respective component pools
   */
  loadDefaultComponents() {
    var me = this;

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
      var id = comp.type;  
      var url = comp.exportImage();

      var label = comp.type.replace('-GATE', '').replace('-BUTTON', '');
      var compItemHTML = 
      '<div class="pool item shadowed">\
        <img class="drag-item" id="' + id + '" src="' + url + '" draggable="true" width="70">\
        <h4 class="controls">' + label + '</h4>\
      </div>';

      return compItemHTML;
    };

    // load into correct containers
    tmpGates.forEach((gate) => {
      var html = loadItemHTML(gate);
      window.$('#gate-items').append(html);
      me.addDragListeners();
    });
    tmpInputs.forEach((input) => {
      let html = loadItemHTML(input);
      window.$('#input-items').append(html);
      me.addDragListeners();
    });
    tmpOutputs.forEach((output) => {
      let html = loadItemHTML(output);
      window.$('#output-items').append(html);
      me.addDragListeners();
    });
  }

  /**
   * Load an imported module into the UI
   * 
   * @param {*} importedModule The Module instance beign loaded
   */
  loadImportedModule(importedModule) {
    var loadItemHTML = (comp) => {
      var id = comp.label;
      var url = comp.exportImage();
      var label = comp.label;
      var compItemHTML = 
      '<div class="pool item shadowed">\
        <img class="drag-item" id="imported_' + id + '" src="' + url + '" draggable="true">\
        <h4 class="controls">' + label + '</h4>\
      </div>';
      return compItemHTML;
    };
    
    var html = loadItemHTML(importedModule);
    window.$('#import-items').append(html);

    this.addDragListeners();
  }

  /**
   * Initialize document-wide key-listening for application
   */
  setupKeyListeners() {
    var me = this;

    window.$(document).keydown((evt) => {
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