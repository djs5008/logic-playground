import { ControlState } from './control-state';

export class PanningState extends ControlState {

  constructor(context) {
    super(context);
  }

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
    this.context.clickPos = new createjs.Point(event.stageX, event.stageY);
  }

  /**
   * Handle right-click up events
   */
  handleRightClickUp() {
    // Move to a hovered state when hovered after selection
    var hoveredComp = this.context.getHoveredComponent();
    var hoveredConn = this.context.getHoveredConnector();
    if (hoveredComp !== null) {
      this.context.setActiveState('HOVER-COMPONENT', hoveredComp);
    } else if (hoveredConn !== null) {
      this.context.setActiveState('HOVER-CONNECTOR', hoveredConn);
    } else {
      this.context.setActiveState('EMPTY');
    }
  }

}