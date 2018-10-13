import { ControlState, States } from './control-state';

export class PanningState extends ControlState {

  /**
   * Handle right-click mouse dragging
   */
  handleMouseDragRight(event) {
    // panning
    let origin = this.context.moduleController.activeModule.startPos;
    let xDiff = (this.context.mousePos.x - this.context.clickPos.x);
    let yDiff = (this.context.mousePos.y - this.context.clickPos.y);
    origin.x += xDiff;
    origin.y += yDiff;
    this.context.selectionRect.x += xDiff;
    this.context.selectionRect.y += yDiff;
    this.context.clickPos = new window.createjs.Point(event.stageX, event.stageY);
  }

  /**
   * Handle right-click up events
   */
  handleRightClickUp() {
    this.unpan();
  }

  handleLeftClickUp() {
    this.unpan();
  }

  unpan() {
    // Move to a hovered state when hovered after selection
    var hoveredComp = this.context.getHoveredComponent();
    var hoveredConn = this.context.getHoveredConnector();
    if (hoveredComp !== null) {
      this.context.setActiveState(States.HOVER_COMPONENT, hoveredComp);
    } else if (hoveredConn !== null) {
      this.context.setActiveState(States.HOVER_CONNECTOR, hoveredConn);
    } else {
      this.context.setActiveState('EMPTY');
    }
  }

}