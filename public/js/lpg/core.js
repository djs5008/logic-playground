/* global createjs,$ */

(() => {

  // disable right-click on canvas
  $('#logic-canvas').bind('contextmenu', () => {
    return false;
  });

  define((require) => {
    'use strict';

    //
    // Requires
    // 
    require('../lib/uuid-random.min'); // UUID-generator
    const SelectionController = require('appl/selection-controller');
    const DrawController = require('appl/draw-controller');
    const ModuleController = require('appl/module-controller');
    const UIController = require('appl/ui-controller');
    const FileController = require('appl/file-controller');

    // 
    // Attributes
    //
    var stage;
    var moduleController;
    var fileController;
    var selectionController;
    var uiController;
    var drawController;

    // Wait for DOM
    $(document).ready(() => {

      // Setup LoadQueue for required images
      // TODO

      // Setup controllers
      stage = new createjs.StageGL('logic-canvas');
      moduleController = new ModuleController();
      fileController = new FileController(moduleController);
      selectionController = new SelectionController(stage, moduleController);
      uiController = new UIController(moduleController, selectionController, fileController);
      drawController = new DrawController(stage, selectionController, moduleController);

      // Initialize application
      initialize();
    });

    /**
     * Default application initialization
     */
    function initialize() {
      // Load saved module (if any)
      fileController.loadSavedModule();

      // Fill default component pools
      uiController.loadDefaultComponents();

      // Handle drag-n-drops
      uiController.setupDragNDropHandler();

      // Handle component pool controls
      uiController.setupPoolControlHandlers();

      // Handle module controls
      uiController.setupModuleControlHandlers();

      // Handle keyboard events
      uiController.setupKeyListeners();
      
      // Start animations
      drawController.startAnimationTimer();

      // Start logic flow
      moduleController.startLogicTimer();

      // setup mouse-event handling
      stage.mouseMoveOutside = true;
      selectionController.initMouseEvents();
    }
  });
})();
