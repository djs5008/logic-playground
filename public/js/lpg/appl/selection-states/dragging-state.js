import { ControlState } from './control-state';

export class DraggingState extends ControlState {

  constructor(context) {
    super(context);
  }

  /**
   * Handle left-click mouse dragging
   */
  handleMouseDragLeft(event) {
    // drag component(s) and selection rect
    let xDiff = (this.context.mousePos.x - this.context.clickPos.x);
    let yDiff = (this.context.mousePos.y - this.context.clickPos.y);
    this.context.selectedComponents.forEach((component) => component.move(xDiff, yDiff));
    this.context.selectionRect.x += xDiff;
    this.context.selectionRect.y += yDiff;
    this.context.clickPos = new createjs.Point(event.stageX, event.stageY);
  }

  /**
   * Handle left-click up events
   */
  handleLeftClickUp() {
    if (this.context.selectedComponents.length === 1) {
      this.context.showComponentSelection();
    }

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