/* global createjs,$ */
define(() => {
  'use strict';

  /**
   * Construct UI Controller
   * 
   * @param {*} moduleController Instance of ModuleController
   * @param {*} selectionController Instance of SelectionController
   * @param {*} fileController Instance of FileController
   */
  function UIController(moduleController, selectionController, fileController) {
    this.moduleController = moduleController;
    this.selectionController = selectionController;
    this.fileController = fileController;
    this.visibleImports = [];

    // TODO: Setup image loadqueue
    // this.preload = new createjs.LoadQueue();
    // img/lpg/and-gate.png

    // Begin checking for imported modules
    this.checkImports();
  }

  /**
   * Initalize drag-n-drop functionality from component pool to stage
   */
  UIController.prototype.setupDragNDropHandler = function () {
    var me = this;

    $('#logic-canvas')
      .on('dragover', function (event) {
        event.preventDefault();
      }).on('drop', function (event) {
        event.preventDefault();
        var data = event.originalEvent.dataTransfer.getData('text/x-component');
        var dragX = event.clientX - $('#logic-canvas').offset().left;
        var dragY = event.clientY - $('#logic-canvas').offset().top;
        var loc = me.selectionController.getRealCoords({ x: dragX, y: dragY });
        var bounds = new createjs.Rectangle(loc.x, loc.y, 0, 0);
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

        if (component != null) {
          // shift component to place at center of cursor
          component.moveTo(
            component.bounds.x - (component.bounds.width / 2),
            component.bounds.y - (component.bounds.height / 2)
          );
        }
      });
  };

  /**
   * Initialize DragNDrop listeners
   */
  UIController.prototype.addDragListeners = function () {
    $('.drag-item').on('dragstart', function (event) {
      event.originalEvent.dataTransfer.setData('text/x-component', event.target.id);
    });
  };

  /**
   * Initialize Module-Controls functionality
   */
  UIController.prototype.setupModuleControlHandlers = function () {
    var me = this;

    $('#controls-new').click(function () {
      if (confirm('Are you sure? You will lose anything not saved!')) {
        me.moduleController.newModule();
        $('#module-name').val(me.moduleController.activeModule.label);
      }
    });

    $('#controls-save').click(function () {
      me.fileController.saveActiveModule();
    });

    $('#controls-export').click(function () {
      me.fileController.exportActiveModule();
    });

    $('#controls-load').click(function () {
      me.fileController.loadModuleFile(me.fileController.loadModule);
    });

    $('#controls-import').click(function () {
      me.fileController.loadModuleFile(me.fileController.importModule);
    });

    $('#module-back-button').click(function(event){
      event.preventDefault();

      // Check if activeModules list is empty
      if (me.moduleController.activeModules.length > 0) {
        var topModule = me.moduleController.activeModules.pop();

        // Set active module
        me.moduleController.activeModule = topModule;

        // Check stack size again after popping
        if (me.moduleController.activeModules.length == 0) {
          // Set module back button visibility
          $('#module-back-button').css('visibility', 'hidden');
        }
      }
    });
  };

  /**
   * Initialize Component-pool controls functionality
   */
  UIController.prototype.setupPoolControlHandlers = function () {

    // Handle component-type buttons
    $('#pool-gates').click(function () {
      $('#component-menu').css('visibility', 'hidden');
      $('#gate-pool').css('visibility', 'visible');
    });

    $('#pool-inputs').click(function () {
      $('#component-menu').css('visibility', 'hidden');
      $('#input-pool').css('visibility', 'visible');
    });

    $('#pool-outputs').click(function () {
      $('#component-menu').css('visibility', 'hidden');
      $('#output-pool').css('visibility', 'visible');
    });

    $('#pool-imports').click(function () {
      $('#component-menu').css('visibility', 'hidden');
      $('#import-pool').css('visibility', 'visible');
    });

    // Handle back buttons
    $('#gate-pool-back').click(function () {
      $('#gate-pool').css('visibility', 'hidden');
      $('#component-menu').css('visibility', 'visible');
    });

    $('#input-pool-back').click(function () {
      $('#input-pool').css('visibility', 'hidden');
      $('#component-menu').css('visibility', 'visible');
    });

    $('#output-pool-back').click(function () {
      $('#output-pool').css('visibility', 'hidden');
      $('#component-menu').css('visibility', 'visible');
    });

    $('#import-pool-back').click(function () {
      $('#import-pool').css('visibility', 'hidden');
      $('#component-menu').css('visibility', 'visible');
    });
  };

  /**
   * Initialize all default component types in their respective component pools
   */
  UIController.prototype.loadDefaultComponents = function () {
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

    var loadItemHTML = function (comp) {
      var id = comp.type;  
      var url = comp.exportImage();

      var label = comp.type.replace('-GATE', '').replace('-BUTTON', '');
      var compItemHTML = 
      '<div class="pool item shadowed">\
        <img class="drag-item" id="' + id + '" src="' + url + '" draggable="true" width="70">\
        <h4 class="noselect controls">' + label + '</h4>\
      </div>';

      return compItemHTML;
    };

    // load into correct containers
    tmpGates.forEach(function (gate) {
      gate.loadImage(() => {
        var html = loadItemHTML(gate);
        $('#gate-items').append(html);
        me.addDragListeners();
      });
    });
    tmpInputs.forEach(function (input) {
      let html = loadItemHTML(input);
      $('#input-items').append(html);
      me.addDragListeners();
    });
    tmpOutputs.forEach(function (output) {
      let html = loadItemHTML(output);
      $('#output-items').append(html);
      me.addDragListeners();
    });
  };

  /**
   * Load an imported module into the UI
   * 
   * @param {*} importedModule The Module instance beign loaded
   */
  UIController.prototype.loadImportedModule = function (importedModule) {
    var loadItemHTML = function (comp) {
      var id = comp.label;
      var url = comp.exportImage();
      var label = comp.label;
      var compItemHTML = 
      '<div class="pool item shadowed">\
        <img class="drag-item" id="imported_' + id + '" src="' + url + '" draggable="true" width="70">\
        <h4 class="noselect controls">' + label + '</h4>\
      </div>';
      return compItemHTML;
    };
    
    var html = loadItemHTML(importedModule);
    $('#import-items').append(html);

    this.addDragListeners();
  };

  /**
   * Initialize document-wide key-listening for application
   */
  UIController.prototype.setupKeyListeners = function () {
    var me = this;

    $(document).keydown(function (evt) {
      const DELETE_KEY = 46;

      switch (evt.keyCode) {
        case DELETE_KEY:
          me.selectionController.selectedComponents.forEach(function (comp) {
            me.moduleController.deleteComponent(me.moduleController.activeModule, comp);
          });
          me.selectionController.selectedComponents = [];
          break;
      }
    });
  };

  /**
   * Retrieve an imported module from sessionStorage that has the current name
   * 
   * @param {*} name The module's label being used to retrieve the module instance
   */
  UIController.prototype.getImportedModule = function (name) {
    var me = this;
    var result = null;
    JSON.parse(sessionStorage.importedModules).forEach(function (importedModule) {
      if (result != null) return false;
      var mod = JSON.parse(importedModule);
      if (mod.label === name) {
        result = me.moduleController.loadModule(mod);
        return false;
      }
    });
    return result;
  };

  /**
   * Initialize check for un-shown imported modules
   */
  UIController.prototype.checkImports = function () {
    var me = this;
    setInterval(function () {
      if (sessionStorage.importedModules !== undefined) {
        JSON.parse(sessionStorage.importedModules).forEach(function (importedModule) {
          if (!me.visibleImports.includes(importedModule)) {
            // load module to module object
            var mod = me.moduleController.loadModule(JSON.parse(importedModule));

            console.log(mod);
            
            // add item to ui
            me.loadImportedModule(mod);

            // add to visibleImports
            me.visibleImports.push(importedModule);
          }
        });
      }
    }, 250);
  };

  return UIController;
});