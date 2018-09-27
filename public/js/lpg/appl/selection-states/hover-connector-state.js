import { ControlState, States } from './control-state';

export class HoverConnectorState extends ControlState {

  constructor(context, hoveredConn) {
    super(context);
    this.hoveredConn = hoveredConn;
    this.hoveredSSD = null;
  }

  /**
   * Handle mouse movement events
   */
  handleMouseMove() {
    let hoveredConn = this.context.getHoveredConnector();

    // Highlight hovered connector state on SEVEN-SEG-DISP
    // TODO : change this to be less-specific
    if (hoveredConn !== null) {
      if (hoveredConn !== this.hoveredConn) {
        this.changeState(States.HOVER_CONNECTOR, hoveredConn);
        return;
      } 
      let hoveredConnComp = this.context.moduleController.activeModule.getComponent(hoveredConn);
      if (hoveredConnComp !== null && hoveredConnComp.type === 'SEVEN-SEG-DISP') {
        hoveredConnComp.setHoveredConnector(hoveredConn);
        this.hoveredSSD = hoveredConnComp;
      }
    } else {
      this.changeState(States.EMPTY);
    }
  }

  /**
   * Handle left-click mouse dragging
   */
  handleMouseDragLeft() {
    this.changeState(States.CONNECTING, this.hoveredConn);
  }

  /**
   * Handle right-click mouse dragging
   */
  handleMouseDragRight() {
    this.changeState(States.PANNING);
  }

  /**
   * Handle left-click up events
   */
  handleLeftClickUp() {
    this.changeState(States.CONNECTING, this.hoveredConn);
  }

  /**
   * Handle right-click up events
   */
  handleRightClickUp() {
    this.context.moduleController.breakConnections(this.hoveredConn);
  }

  changeState(newState, data) {
    // Reset SSD hover hint
    if (this.hoveredSSD !== null) {
      this.hoveredSSD.setHoveredConnector(null);
      this.hoveredSSD = null;
    }

    // Set new state (with data passed)
    this.context.setActiveState(newState, data);
  }

}