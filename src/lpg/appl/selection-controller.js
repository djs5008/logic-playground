// 
// Includes
// 
import { EmptyState } from './selection-states/empty-state';
import { HoverConnectorState } from './selection-states/hover-connector-state';
import { HoverComponentState } from './selection-states/hover-component-state';
import { PanningState } from './selection-states/panning-state';
import { SelectingState } from './selection-states/selecting-state';
import { DraggingState } from './selection-states/dragging-state';
import { ConnectingState } from './selection-states/connecting-state';
import { States } from './selection-states/control-state';

import { store } from '../../store/store';
import { setSettingsState } from '../../actions/actions';
import { SettingStates } from '../../components/settings-state';

// 
// Constants
// 
const LEFT_CLICK_ID = 0;
const RIGHT_CLICK_ID = 2;

export class SelectionController {

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
    this.activeState = null;
      
    this.activeClick = null;        // Type of click stored currently (check IDs above)
    this.selectionRect = 
      new window.createjs.Rectangle();     // Current selection rectangle
    this.selectedComponents = [];   // Finalized list of currently selected components
    this.selectedConnector = null;  // Instance of previously selected connector

    this.hoveredConn = null;    // Store the currently hovered connector
    this.hoveredComp = null;    // Store the currently hovered component

    // NOTE: All coordinates are stored in canvas-relative coordinates
    //        and can be converted to real coordinates using getRealCoords()
    this.clickPos = null;               // Position of click (reset on mouseup)
    this.mousePos = null;               // Position of mouse
  }

  /**
   * Set the current state to handle state-specific behavior
   *  Each state will dispatch and handle appropriate behavior based on that state
   */
  setActiveState(state, args) {
    switch (state) {
      case States.EMPTY: this.activeState = new EmptyState(this); break;
      case States.PANNING: this.activeState = new PanningState(this); break;
      case States.SELECTING: this.activeState = new SelectingState(this); break;
      case States.HOVER_COMPONENT: this.activeState = new HoverComponentState(this, args); break;
      case States.HOVER_CONNECTOR: this.activeState = new HoverConnectorState(this, args); break;
      case States.DRAGGING: this.activeState = new DraggingState(this); break;
      case States.CONNECTING: this.activeState = new ConnectingState(this, args); break;
      default: console.error('INVALID STATE RECEIVED');
    }
    this.activeState.name = state;
  }

  /**
   * Retrieves the label for the active state
   *  This DOES NOT retrieve the current active state instance
   *  Use "activeState" property to retrieve instance of active state
   */
  getActiveState() {
    return this.activeState.name;
  }

  /**
   * Function to setup mouse-event handlings
   */
  initMouseEvents() {
    let me = this;

    // handle mouse presses
    me.stage.on('stagemousedown', (evt) => {
      me.activeClick = evt.nativeEvent.button;
      me.clickPos = new window.createjs.Point(evt.stageX, evt.stageY );

      // right/left mouse down event handling
      if (me.isLeftClicking()) {
        me.activeState.handleLeftClickDown(evt);
      } else if (me.isRightClicking()) {
        me.activeState.handleRightClickDown(evt);
      }
    });

    // handle mouse releases
    me.stage.on('stagemouseup', (evt) => {

      // right/left mouse up event handling
      if (me.isLeftClicking()) {
        me.activeState.handleLeftClickUp(evt);
      } else if (me.isRightClicking()) {
        me.activeState.handleRightClickUp(evt);
      }

      // Reset selection properties
      me.activeClick = null;
      me.clickPos = null;
    });

    // handle mouse movement
    me.stage.on('stagemousemove', (evt) => {
      // Update stored mouse position
      me.mousePos = new window.createjs.Point(evt.stageX, evt.stageY);

      // handle general mouse move events
      me.activeState.handleMouseMove(evt);

      // right/left mouse drag event handling
      if (me.isLeftClicking()) {
        me.activeState.handleMouseDragLeft(evt);
      } else if (me.isRightClicking()) {
        me.activeState.handleMouseDragRight(evt);
      }
    });

    // Handle double clicking on embedded module
    me.stage.on('dblclick', (evt) => {
      me.activeState.handleDoubleClick(evt);
    });
  }

  /**
   * Retrieve the currently hovered component in the active module
   */
  getHoveredComponent() {
    let me = this;
    let hoveredComp = null;
    if (me.mousePos !== null && me.hoveredConn === null) {
      me.moduleController.getActiveModule().components.forEach((component) => {
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
    if (me.mousePos !== null) {
      me.moduleController.getActiveModule().components.forEach((component) => {
        if (hoveredConn !== null) return false;
        let mousePosReal = me.getRealCoords(me.mousePos);
        component.getConnectors().forEach((connector) => {
          let width = connector.getRealBounds().width;
          let height = connector.getRealBounds().height;
          let wideBounds = new window.createjs.Rectangle(
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
      me.moduleController.getActiveModule().components.forEach((component) => {
        let selectionPosReal = me.getRealCoords({ x: me.selectionRect.x, y: me.selectionRect.y });
        let selectionRect = 
          new window.createjs.Rectangle(
            selectionPosReal.x, 
            selectionPosReal.y, 
            me.selectionRect.width, 
            me.selectionRect.height);
        if (component.bounds.intersects(selectionRect)) {
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
    me.selectionRect = new window.createjs.Rectangle(minX, minY, maxX - minX, maxY - minY);
  }

  /**
   * Clear the current selection and reset selection state
   */
  clearSelection() {
    this.selectionRect = new window.createjs.Rectangle();
    this.selectedComponents = [];
    this.toggleComponentSettings(SettingStates.MODULE);
  }

  /**
   * Toggle between component and module settings box
   * @param {boolean} visible 
   */
  toggleComponentSettings(state) {
    store.dispatch(setSettingsState(state));
  }

  /**
   * Show the component selection menu
   */
  showComponentSelection() {
    // show single piece settings
    // let label = (this.selectedComponents[0].label === '') 
    //   ? 'no label' 
    //   : this.selectedComponents[0].label;
    this.toggleComponentSettings(SettingStates.COMPONENT);
    // TODO:  window.$('#component-name').val(label);
    // TODO: this.selectedComponents[0].loadSettings(window.$('#component-control-loader'));
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
    let origin = this.moduleController.getActiveModule().startPos;
    return { x: canvasPos.x - origin.x, y: canvasPos.y - origin.y };
  }

  /**
   * Helper function to retrieve canvas-coordinates from real-coordinates
   * @param { x: real x-coord, y: real y-coord } realPos
   * @returns { x: canvas x-coord, y: canvas y-coord }
   */
  getScreenCoords(realPos) {
    let origin = this.moduleController.getActiveModule().startPos;
    return { x: realPos.x + origin.x, y: realPos.y + origin.y };
  }
}