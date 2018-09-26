import { ControlState } from './control-state';

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
        this.changeState('HOVER-CONNECTOR', hoveredConn);
        return;
      } 
      let hoveredConnComp = this.context.moduleController.activeModule.getComponent(hoveredConn);
      if (hoveredConnComp !== null && hoveredConnComp.type === 'SEVEN-SEG-DISP') {
        hoveredConnComp.setHoveredConnector(hoveredConn);
        this.hoveredSSD = hoveredConnComp;
      }
    } else {
      this.changeState('EMPTY');
    }
  }

  /**
   * Handle left-click mouse dragging
   */
  handleMouseDragLeft() {
    this.changeState('CONNECTING', this.hoveredConn);
  }

  /**
   * Handle right-click mouse dragging
   */
  handleMouseDragRight() {
    this.changeState('PANNING');
  }

  /**
   * Handle left-click up events
   */
  handleLeftClickUp() {
    this.changeState('CONNECTING', this.hoveredConn);
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