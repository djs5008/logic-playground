//
// Imports
// 
import { SelectionController } from './appl/selection-controller';
import { DrawController } from './appl/draw-controller';
import { ModuleController } from './appl/module-controller';
import { UIController } from './appl/ui-controller';
import { FileController } from './appl/file-controller';
import { ResourceController } from './appl/resource-controller';

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

(() => {

  // Wait for DOM
  window.$(document).ready(() => {

    // Setup controllers
    console.info('loading stage...');
    stage = new window.createjs.StageGL('logic-canvas');
    resourceController = new ResourceController();
    moduleController = new ModuleController(resourceController);
    fileController = new FileController(moduleController);
    selectionController = new SelectionController(stage, moduleController);
    uiController = new UIController(moduleController, selectionController, fileController);
    drawController = new DrawController(stage, selectionController, moduleController, resourceController);

    // Initialize application
    initialize();
  });

  /**
   * Default application initialization
   */
  function initialize() {

    // disable right-click on canvas
    window.$('#logic-canvas').bind('contextmenu', () => {
      return false;
    });

    // Pre-fit the stage to make it look not-ugly
    drawController.fitStage();

    // Load required resources
    //  Wait for these to complete before doing any other processing
    resourceController.loadResources(() => {

      // Load saved module (if any)
      fileController.loadSavedModule();

      // Start painting
      drawController.startPainting();

      // Start animations
      drawController.startAnimationTimer();

      // Fill default component pools
      uiController.loadDefaultComponents();

      // Handle drag-n-drops
      uiController.setupDragNDropHandler();

      // Handle module controls
      uiController.setupModuleControlHandlers();

      // Handle keyboard events
      uiController.setupKeyListeners();

      // Begin checking for imported modules
      uiController.checkImports();

      // Update connection mappings
      moduleController.activeModule.updateConnectorMap();

      // Start logic flow
      moduleController.startLogicTimer();

      // setup mouse-event handling
      stage.mouseMoveOutside = true;
      selectionController.initMouseEvents();
      selectionController.setActiveState('EMPTY');
    });
  }
})();
