/* global createjs,$ */
define(() => {
  'use strict';

  // 
  // Constants
  // 
  const LEFT_CLICK_ID = 0;
  const RIGHT_CLICK_ID = 2;

  class SelectionController {

    /**
     * SelectionController constructor
     * 
     * @param {createjs.StageGL} stage 
     * @param {ModuleController} moduleController 
     */
    constructor(stage, moduleController) {
      this.stage = stage;             // EaselJS CanvasGL instance
      this.moduleController =
        moduleController;             // Instance of ModuleController passed by Core
        
      this.activeClick = null;        // Type of click stored currently (check IDs above)
      this.selectionRect = 
        new createjs.Rectangle();     // Current selection rectangle
      this.selectedComponents = [];   // Finalized list of currently selected components
      this.dragPiece = null;          // Instance of component that initialized the drag
      this.selectedConnector = null;  // Instance of previously selected connector
  
      this.hoveredConn = null;    // Store the currently hovered connector
      this.hoveredComp = null;    // Store the currently hovered component
      this.hoveredSSD = null;

      // NOTE: All coordinates are stored in canvas-relative coordinates
      //        and can be converted to real coordinates using getRealCoords()
      this.clickPos = null;               // Position of click (reset on mouseup)
      this.mousePos = null;               // Position of mouse
    }

    /**
     * Function to setup mouse-event handlings
     */
    initMouseEvents() {
      let me = this;

      // handle mouse clicks
      me.stage.on('stagemousedown', (evt) => {
        me.activeClick = evt.nativeEvent.button;
        me.clickPos = new createjs.Point(evt.stageX, evt.stageY);

        if (me.isLeftClicking()) {
          me.selectionRect = new createjs.Rectangle(me.clickPos.x, me.clickPos.y, 0, 0);

          // allow single piece selections
          me.dragPiece = (!me.isDraggingComponents()) ? me.hoveredComp : me.dragPiece;
          if (me.hoveredComp !== null && !me.selectedComponents.includes(me.hoveredComp)) {
            me.selectedComponents = [me.dragPiece];
            me.selectedConnector = null;

            // show single piece settings
            let label = (me.selectedComponents[0].label === '') ? 'no label' : me.selectedComponents[0].label;
            me.toggleComponentSettings(true);
            $('#component-name').val(label);
            me.selectedComponents[0].loadSettings($('#component-control-loader'));
          }
        }

        // right-click mouse down handling
        else if (me.isRightClicking()) {
          if (me.hoveredComp !== null) {
            me.hoveredComp.rightClickDownEvent();
          }
        }
      });

      // handle mouse releases
      me.stage.on('stagemouseup', () => {

        // handle left mouse releases
        if (me.isLeftClicking()) {

          // set selectedConnector when a click was released on a hovered one
          if (me.selectedConnector === null && me.hoveredConn !== null) {
            me.selectedConnector = me.hoveredConn;
          }

          // clear selectedConnector when a click was not releasted on hovered one
          else if (me.selectedConnector !== null && me.hoveredConn === null) {
            me.selectedConnector = null;
          }

          // connect the connectors when you release on a hovered connector
          else if (me.selectedConnector !== null
            && me.hoveredConn !== null
            && me.selectedConnector !== me.hoveredConn
            && me.selectedConnector.isOutput() !== me.hoveredConn.isOutput()
            && !me.selectedConnector.getConnections().includes(me.hoveredConn.getID())
            && !me.hoveredConn.getConnections().includes(me.selectedConnector.getID())) {
            // make sure connectors are mapped from output->input
            let outConn = (me.selectedConnector.isOutput()) ? me.selectedConnector : me.hoveredConn;
            let otherConn = (outConn === me.selectedConnector) ? me.hoveredConn : me.selectedConnector;
            outConn.addConnection(otherConn);
            me.selectedConnector = null;
          }

          // wrap current selection on mouse up
          if (me.getSelectedComponents().length > 0) {
            me.wrapSelection();
          }

          // Reset component selections
          else {
            me.clearSelection();
          }

          // Don't show component settings when more than one component selected
          if (me.getSelectedComponents().length > 1) {
            me.toggleComponentSettings(false);
          }
        }

        // Handle right mouse releases
        else if (me.isRightClicking()) {
          // break connections of hoveredConn on right-click
          if (me.selectedConnector === null && me.hoveredConn !== null) {
            me.moduleController.breakConnections(me.hoveredConn);
          }

          // Toggle buttons
          if (me.hoveredComp !== null) {
            me.hoveredComp.rightClickUpEvent();
          }
        }

        me.dragPiece = null;
        me.activeClick = null;
        me.clickPos = null;
      });

      // handle mouse movement
      me.stage.on('stagemousemove', (evt) => {
        me.mousePos = new createjs.Point(evt.stageX, evt.stageY);

        // Update hovered vars
        me.hoveredConn = me.getHoveredConnector();
        me.hoveredComp = me.getHoveredComponent();

        // Highlight hovered connector state on SEVEN-SEG-DISP
        // TODO : change this to be less-specific
        if (me.hoveredConn !== null) {
          let hoveredConnComp = me.moduleController.activeModule.getComponent(me.hoveredConn);
          if (hoveredConnComp !== null && hoveredConnComp.type === 'SEVEN-SEG-DISP') {
            hoveredConnComp.setHoveredConnector(me.hoveredConn);
            me.hoveredSSD = hoveredConnComp;
          }
        } 
        
        // Reset SEVEN-SEG-DISP hovered state
        else if (me.hoveredSSD !== null) {
          me.hoveredSSD.setHoveredConnector(null);
          me.hoveredSSD = null;
        }

        // handle right-clicks
        if (me.isRightClicking()) {
          // panning
          let origin = me.moduleController.activeModule.startPos;
          let xDiff = (me.mousePos.x - me.clickPos.x);
          let yDiff = (me.mousePos.y - me.clickPos.y);
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
            let xDiff = (me.mousePos.x - me.clickPos.x);
            let yDiff = (me.mousePos.y - me.clickPos.y);
            me.selectedComponents.forEach((component) => component.move(xDiff, yDiff));
            me.selectionRect.x += xDiff;
            me.selectionRect.y += yDiff;
            me.clickPos = new createjs.Point(evt.stageX, evt.stageY);
          }
        }
      });

      // Handle double clicking on embedded module
      me.stage.on('dblclick', () => {
        if (me.selectedComponents.length === 1) {
          let selectedComponent = me.selectedComponents[0];
          if (selectedComponent.type === 'MODULE') {
            // Add active module to stack of current modules
            me.moduleController.activeModules.push(me.moduleController.activeModule);

            // Set active module
            me.moduleController.activeModule = selectedComponent;

            // Reset component selections
            me.clearSelection();

            // Set module back button visibility
            $('#module-back-button').css('visibility', 'visible');
            $('#module-name').val(me.moduleController.activeModule.label);
          }
        }
      });
    }

    /**
     * Retrieve the currently hovered component in the active module
     */
    getHoveredComponent() {
      let me = this;
      let hoveredComp = null;
      if (me.mousePos !== null && !me.isSelecting() && me.hoveredConn === null) {
        me.moduleController.activeModule.components.forEach((component) => {
          let mousePosReal = me.getRealCoords(me.mousePos);
          if (component.bounds.contains(mousePosReal.x, mousePosReal.y)) {
            hoveredComp = component;
            return false;
          }
        });
      }
      return hoveredComp;
    }

    /**
     * Retrieve the currently hovered connector in the active module
     */
    getHoveredConnector() {
      let me = this;
      let hoveredConn = null;
      if (me.mousePos !== null && !me.isSelecting()) {
        me.moduleController.activeModule.components.forEach((component) => {
          if (hoveredConn !== null) return false;
          let mousePosReal = me.getRealCoords(me.mousePos);
          component.getConnectors().forEach((connector) => {
            let width = connector.getRealBounds().width;
            let height = connector.getRealBounds().height;
            let wideBounds = new createjs.Rectangle(
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
    }

    /**
     * Retrieve an array of currently selected components
     */
    getSelectedComponents() {
      let me = this;
      let selectedComps = [];
      if (me.selectionRect !== null) {
        me.moduleController.activeModule.components.forEach((component) => {
          let selectionPosReal = me.getRealCoords({ x: me.selectionRect.x, y: me.selectionRect.y });
          if (component.bounds.intersects(
            new createjs.Rectangle(selectionPosReal.x, selectionPosReal.y, me.selectionRect.width, me.selectionRect.height))) {
            selectedComps.push(component);
          }
        });
      }
      return selectedComps;
    }

    /**
     * Retrieve the currently selected connector
     */
    getSelectedConnector() {
      return this.selectedConnector;
    }

    /**
     * Check whether or not the user is currently creating a selection box
     */
    isSelecting() {
      return this.activeClick === LEFT_CLICK_ID 
          && this.selectionRect !== null
          && this.selectionRect.width > 0 
          && this.selectionRect.height > 0;
    }

    /**
     * Re-form the selection box around all of the selected components
     */
    wrapSelection() {
      let me = this;
      let minX = this.selectionRect.x + this.selectionRect.width;
      let minY = this.selectionRect.y + this.selectionRect.height;
      let maxX = this.selectionRect.x;
      let maxY = this.selectionRect.y;
      me.selectedComponents.forEach((component) => {
        let screenPos = me.getScreenCoords(component.bounds);
        minX = (screenPos.x <= minX) ? screenPos.x : minX;
        minY = (screenPos.y <= minY) ? screenPos.y : minY;
        maxX = (screenPos.x + component.bounds.width >= maxX) ? screenPos.x + component.bounds.width : maxX;
        maxY = (screenPos.y + component.bounds.height >= maxY) ? screenPos.y + component.bounds.height : maxY;
      });
      me.selectionRect = new createjs.Rectangle(minX, minY, maxX - minX, maxY - minY);
    }

    /**
     * Clear the current selection and reset selection state
     */
    clearSelection() {
      this.selectionRect = new createjs.Rectangle();
      this.selectedComponents = [];
      this.toggleComponentSettings(false);
    }

    /**
     * Toggle between component and module settings box
     * @param {boolean} visible 
     */
    toggleComponentSettings(visible) {
      $('#component-controls').css('visibility', visible ? 'visible' : 'hidden');
      $('#module-controls').css('visibility', visible ? 'hidden' : 'visible');
    }
    
    /**
     * Helper function to determine whether the user is currently holding left-click
     */
    isLeftClicking() {
      return this.activeClick === LEFT_CLICK_ID;
    }

    /**
     * Helper function to determine whether the user is currently holding right-click
     */
    isRightClicking() {
      return this.activeClick === RIGHT_CLICK_ID;
    }

    /**
     * Helper function to determine whether the user is currently dragging a selection around
     */
    isDraggingComponents() {
      return this.dragPiece !== null;
    }

    /**
     * Retrieve the current mouse location on stage
     */
    getMouseLoc() {
      return this.mousePos;
    }

    /**
     * Retrieve an instance of the current selection bounds
     */
    getSelectionRect() {
      return this.selectionRect;
    }

    /**
     * Helper function to retrieve real-coordinates based on canvas-coordinates
     * @param { x: canvas x-coord, y: canvas y-coord } canvasPos
     * @returns { x: real x-coord, y: real y-coord }
     */
    getRealCoords(canvasPos) {
      let origin = this.moduleController.activeModule.startPos;
      return { x: canvasPos.x - origin.x, y: canvasPos.y - origin.y };
    }

    /**
     * Helper function to retrieve canvas-coordinates from real-coordinates
     * @param { x: real x-coord, y: real y-coord } realPos
     * @returns { x: canvas x-coord, y: canvas y-coord }
     */
    getScreenCoords(realPos) {
      let origin = this.moduleController.activeModule.startPos;
      return { x: realPos.x + origin.x, y: realPos.y + origin.y };
    }
  }

  return SelectionController;
});