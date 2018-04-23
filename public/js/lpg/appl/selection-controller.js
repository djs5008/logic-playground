/* global createjs,$ */
define(function () {
  'use strict';

  // 
  // Constants
  // 
  const LEFT_CLICK_ID = 0;
  const RIGHT_CLICK_ID = 2;

  /**
   * SelectionController constructor
   * 
   * @param {createjs.StageGL} stage 
   * @param {ModuleController} moduleController 
   */
  function SelectionController(stage, moduleController) {
    this.stage = stage;             // EaselJS Canvas instance
    this.activeClick = null;        // Type of click stored currently (check IDs above)
    this.selectionRect =
      { x: 0, y: 0, w: 0, h: 0 };   // Current selection rectangle
    this.moduleController =
      moduleController;             // Instance of ModuleController passed by Core
    this.selectedComponents = [];   // Finalized list of currently selected components
    this.dragPiece = null;          // Instance of component that initialized the drag
    this.selectedConnector = null;  // Instance of previously selected connector

    // NOTE: All coordinates are stored in canvas-relative coordinates
    //        and can be converted to real coordinates using getRealCoords()
    this.clickPos = null;           // Position of click (reset on mouseup)
    this.mousePos = null;           // Position of mouse
  }

  /**
   * Function to setup mouse-event handlings
   */
  SelectionController.prototype.initMouseEvents = function () {
    var me = this;

    // handle mouse clicks
    me.stage.on('stagemousedown', function (evt) {
      me.activeClick = evt.nativeEvent.button;
      me.clickPos = new createjs.Point(evt.stageX, evt.stageY);
      var hoveredComponent = me.getHoveredComponent();

      if (me.isLeftClicking()) {
        me.selectionRect = new createjs.Rectangle(me.clickPos.x, me.clickPos.y, 0, 0);
        hoveredComponent = me.getHoveredComponent();

        // allow single piece selections
        me.dragPiece = (!me.isDraggingComponents()) ? hoveredComponent : me.dragPiece;
        if (hoveredComponent !== null && !me.selectedComponents.includes(hoveredComponent)) {
          me.selectedComponents = [me.dragPiece];
          me.selectedConnector = null;

          // show single piece settings
          $('#component-controls').css('visibility', 'visible');
          $('#module-controls').css('visibility', 'hidden');
        }
      }

      // right-click mouse down handling
      else if (me.isRightClicking()) {
        if (hoveredComponent !== null) {
          // Toggle hold buttons
          if (hoveredComponent.type === 'HOLD-BUTTON') {
            hoveredComponent.setState(!hoveredComponent.getState());
          }
        }
      }
    });

    // handle mouse releases
    me.stage.on('stagemouseup', function () {
      var hoveredConnector = me.getHoveredConnector();
      var hoveredComponent = me.getHoveredComponent();

      // handle left mouse releases
      if (me.isLeftClicking()) {

        // set selectedConnector when a click was released on a hovered one
        if (me.selectedConnector === null && hoveredConnector !== null) {
          me.selectedConnector = hoveredConnector;
        }

        // clear selectedConnector when a click was not releasted on hovered one
        else if (me.selectedConnector !== null && hoveredConnector === null) {
          me.selectedConnector = null;
        }

        // connect the connectors when you release on a hovered connector
        else if (me.selectedConnector !== null
          && hoveredConnector !== null
          && me.selectedConnector !== hoveredConnector
          && me.selectedConnector.isOutput() != hoveredConnector.isOutput()
          && !me.selectedConnector.getConnections().includes(hoveredConnector.getID())
          && !hoveredConnector.getConnections().includes(me.selectedConnector.getID())) {
          // make sure connectors are mapped from output->input
          var outConn = (me.selectedConnector.isOutput()) ? me.selectedConnector : hoveredConnector;
          var otherConn = (outConn === me.selectedConnector) ? hoveredConnector : me.selectedConnector;
          outConn.addConnection(otherConn);
          me.selectedConnector = null;
        }

        // wrap current selection on mouse up
        if (me.getSelectedComponents().length > 0) {
          me.wrapSelection();
        }

        // Reset component selections
        else {
          if (me.selectedComponents.length > 0) {
            me.selectedComponents = [];
          }

          // revert back to module settings
          $('#component-controls').css('visibility', 'hidden');
          $('#module-controls').css('visibility', 'visible');
        }
      }

      // Handle right mouse releases
      else if (me.isRightClicking()) {
        // break connections of hoveredConn on right-click
        if (me.selectedConnector === null && hoveredConnector !== null) {
          me.moduleController.breakConnections(hoveredConnector);
        }

        // Toggle buttons
        if (hoveredComponent !== null) {
          if (hoveredComponent.isInputComp() && hoveredComponent.isToggleable()) {
            hoveredComponent.setState(!hoveredComponent.getState());
          }
        }
      }

      me.dragPiece = null;
      me.activeClick = null;
      me.clickPos = null;
    });

    // handle mouse movement
    me.stage.on('stagemousemove', function (evt) {
      me.mousePos = new createjs.Point(evt.stageX, evt.stageY);

      var xDiff = 0;
      var yDiff = 0;

      // handle right-clicks
      if (me.isRightClicking()) {
        // panning
        var origin = me.moduleController.activeModule.startPos;
        xDiff = (me.mousePos.x - me.clickPos.x);
        yDiff = (me.mousePos.y - me.clickPos.y);
        origin.x += xDiff;
        origin.y += yDiff;
        me.selectionRect.x += xDiff;
        me.selectionRect.y += yDiff;
        me.clickPos = new createjs.Point(evt.stageX, evt.stageY);
      }

      // handle left clicks
      else if (me.isLeftClicking()) {
        // selecting
        if (!me.isDraggingComponents()) {
          // maintain finalize list of selected components while selecting
          me.selectedComponents = me.getSelectedComponents();
          me.selectionRect = new createjs.Rectangle(
            ((me.mousePos.x > me.clickPos.x) ? me.clickPos.x : me.mousePos.x),
            ((me.mousePos.y > me.clickPos.y) ? me.clickPos.y : me.mousePos.y),
            ((me.mousePos.x > me.clickPos.x) ? me.mousePos.x - me.clickPos.x : me.clickPos.x - me.mousePos.x),
            ((me.mousePos.y > me.clickPos.y) ? me.mousePos.y - me.clickPos.y : me.clickPos.y - me.mousePos.y)
          );
        }

        // dragging
        else {
          // drag component(s) and selection rect
          xDiff = (me.mousePos.x - me.clickPos.x);
          yDiff = (me.mousePos.y - me.clickPos.y);
          me.selectedComponents.forEach(function (component) {
            component.moveTo(
              component.bounds.x + xDiff,
              component.bounds.y + yDiff
            );
          });
          me.selectionRect.x += xDiff;
          me.selectionRect.y += yDiff;
          me.clickPos = new createjs.Point(evt.stageX, evt.stageY);
        }
      }
    });

    // Handle double clicking on embedded module
    me.stage.on('dblclick', function () {
      if (me.selectedComponents.length === 1) {
        var selectedComponent = me.selectedComponents[0];
        if (selectedComponent.type === 'MODULE') {
          // Add active module to stack of current modules
          me.moduleController.activeModules.push(me.moduleController.activeModule);

          // Set active module
          me.moduleController.activeModule = selectedComponent;

          // Reset component selections
          me.selectionRect = new createjs.Rectangle(0, 0);
          me.selectedComponents = [];

          // Set module back button visibility
          $('#module-back-button').css('visibility', 'visible');
        }
      }
    });
  };

  /**
   * Retrieve the currently hovered component in the active module
   */
  SelectionController.prototype.getHoveredComponent = function () {
    var me = this;
    var hoveredComp = null;
    if (me.mousePos !== null && !me.isSelecting() && me.getHoveredConnector() === null) {
      me.moduleController.activeModule.components.forEach(function (component) {
        var mousePosReal = me.getRealCoords(me.mousePos);
        if (component.bounds.contains(mousePosReal.x, mousePosReal.y)) {
          hoveredComp = component;
          return false;
        }
      });
    }
    return hoveredComp;
  };

  /**
   * Retrieve the currently hovered connector in the active module
   */
  SelectionController.prototype.getHoveredConnector = function () {
    var me = this;
    var hoveredConn = null;
    if (me.mousePos !== null && !me.isSelecting()) {
      me.moduleController.activeModule.components.forEach(function (component) {
        if (hoveredConn !== null) return false;
        var mousePosReal = me.getRealCoords(me.mousePos);
        component.getConnectors().forEach(function (connector) {
          var width = connector.getRealBounds().width;
          var height = connector.getRealBounds().height;
          var wideBounds = new createjs.Rectangle(
            connector.getRealBounds().x - (width / 2),
            connector.getRealBounds().y - (height / 2),
            connector.getRealBounds().width * 2,
            connector.getRealBounds().height * 2
          );
          if (wideBounds.contains(mousePosReal.x, mousePosReal.y)) {
            hoveredConn = connector;
            return false;
          }
        });
      });
    }
    return hoveredConn;
  };

  /**
   * Retrieve an array of currently selected components
   */
  SelectionController.prototype.getSelectedComponents = function () {
    var me = this;
    var selectedComps = [];
    if (me.selectionRect !== null) {
      me.moduleController.activeModule.components.forEach(function (component) {
        var selectionPosReal = me.getRealCoords({ x: me.selectionRect.x, y: me.selectionRect.y });
        if (component.bounds.intersects(
          new createjs.Rectangle(selectionPosReal.x, selectionPosReal.y, me.selectionRect.width, me.selectionRect.height))) {
          selectedComps.push(component);
        }
      });
    }
    return selectedComps;
  };

  /**
   * Retrieve the currently selected connector
   */
  SelectionController.prototype.getSelectedConnector = function () {
    return this.selectedConnector;
  };

  /**
   * Check whether or not the user is currently creating a selection box
   */
  SelectionController.prototype.isSelecting = function () {
    return this.activeClick === LEFT_CLICK_ID && this.selectionRect.width > 0 && this.selectionRect.height > 0;
  };

  /**
   * Re-form the selection box around all of the selected components
   */
  SelectionController.prototype.wrapSelection = function () {
    var me = this;
    var minX = this.selectionRect.x + this.selectionRect.width;
    var minY = this.selectionRect.y + this.selectionRect.height;
    var maxX = this.selectionRect.x;
    var maxY = this.selectionRect.y;
    me.selectedComponents.forEach(function (component) {
      var screenPos = me.getScreenCoords(component.bounds);
      minX = (screenPos.x <= minX) ? screenPos.x : minX;
      minY = (screenPos.y <= minY) ? screenPos.y : minY;
      maxX = (screenPos.x + component.bounds.width >= maxX) ? screenPos.x + component.bounds.width : maxX;
      maxY = (screenPos.y + component.bounds.height >= maxY) ? screenPos.y + component.bounds.height : maxY;
    });
    me.selectionRect = new createjs.Rectangle(minX, minY, maxX - minX, maxY - minY);
  };

  /**
   * Helper function to determine whether the user is currently holding left-click
   */
  SelectionController.prototype.isLeftClicking = function () {
    return this.activeClick === LEFT_CLICK_ID;
  };

  /**
   * Helper function to determine whether the user is currently holding right-click
   */
  SelectionController.prototype.isRightClicking = function () {
    return this.activeClick === RIGHT_CLICK_ID;
  };

  /**
   * Helper function to determine whether the user is currently dragging a selection around
   */
  SelectionController.prototype.isDraggingComponents = function () {
    return this.dragPiece !== null;
  };

  /**
   * Retrieve the current mouse location on stage
   */
  SelectionController.prototype.getMouseLoc = function () {
    return this.mousePos;
  };

  /**
   * Retrieve an instance of the current selection bounds
   */
  SelectionController.prototype.getSelectionRect = function () {
    return this.selectionRect;
  };

  /**
   * Helper function to retrieve real-coordinates based on canvas-coordinates
   * @param { x: canvas x-coord, y: canvas y-coord } canvasPos
   * @returns { x: real x-coord, y: real y-coord }
   */
  SelectionController.prototype.getRealCoords = function (canvasPos) {
    var origin = this.moduleController.activeModule.startPos;
    return { x: canvasPos.x - origin.x, y: canvasPos.y - origin.y };
  };

  /**
   * Helper function to retrieve canvas-coordinates from real-coordinates
   * @param { x: real x-coord, y: real y-coord } realPos
   * @returns { x: canvas x-coord, y: canvas y-coord }
   */
  SelectionController.prototype.getScreenCoords = function (realPos) {
    var origin = this.moduleController.activeModule.startPos;
    return { x: realPos.x + origin.x, y: realPos.y + origin.y };
  };

  return SelectionController;
});