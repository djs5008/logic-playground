/* global createjs,$ */

(() => {

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
    const ResourceController = require('appl/resource-controller');

    // 
    // Attributes
    //
    var stage;
    var moduleController;
    var fileController;
    var selectionController;
    var uiController;
    var drawController;
    var resourceController;

    // Wait for DOM
    $(document).ready(() => {

      // Setup controllers
      console.info('loading stage...');
      stage = new createjs.StageGL('logic-canvas');
      resourceController = new ResourceController();
      moduleController = new ModuleController(resourceController);
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

      // disable right-click on canvas
      $('#logic-canvas').bind('contextmenu', () => {
        return false;
      });

      // Pre-fit the stage to make it look not-ugly
      drawController.fitStage();

      // Load required resources
      //  Wait for these to complete before doing any other processing
      resourceController.loadResources(() => {

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

        // Begin checking for imported modules
        uiController.checkImports();

        // Start logic flow
        moduleController.startLogicTimer();

        // setup mouse-event handling
        stage.mouseMoveOutside = true;
        selectionController.initMouseEvents();
        selectionController.setActiveState('EMPTY');

        // Start painting
        drawController.startPainting();

        // Start animations
        drawController.startAnimationTimer();

      });
    }
  });
})();
