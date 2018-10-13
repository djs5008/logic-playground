import { ControlState, States } from './control-state';

export class SelectingState extends ControlState {

  /**
   * Handle left-click mouse dragging
   */
  handleMouseDragLeft() {
    // maintain finalize list of selected components while selecting
    let mousePos = this.context.mousePos;
    let clickPos = this.context.clickPos;
    this.context.selectedComponents = this.context.getSelectedComponents();
    this.context.selectionRect = new window.createjs.Rectangle(
      ((mousePos.x > clickPos.x) ? clickPos.x : mousePos.x),
      ((mousePos.y > clickPos.y) ? clickPos.y : mousePos.y),
      ((mousePos.x > clickPos.x) ? mousePos.x - clickPos.x : clickPos.x - mousePos.x),
      ((mousePos.y > clickPos.y) ? mousePos.y - clickPos.y : clickPos.y - mousePos.y)
    );
  }

  /**
   * Handle left-click up events
   */
  handleLeftClickUp() {

    // wrap current selection on mouse up
    if (this.context.getSelectedComponents().length > 0) {
      this.context.wrapSelection();
    }

    // Reset component selections
    else {
      this.context.clearSelection();
    }

    // Don't show component settings when more than one component selected
    if (this.context.getSelectedComponents().length > 1) {
      this.context.toggleComponentSettings(false);
    }

    // Move to a hovered state when hovered after selection
    var hoveredComp = this.context.getHoveredComponent();
    var hoveredConn = this.context.getHoveredConnector();
    if (hoveredComp !== null) {
      this.context.setActiveState(States.HOVER_COMPONENT, hoveredComp);
    } else if (hoveredConn !== null) {
      this.context.setActiveState(States.HOVER_CONNECTOR, hoveredConn);
    } else {
      this.context.setActiveState(States.EMPTY);
    }
  }

  handleDoubleClick() {
    this.context.setActiveState(States.PANNING);
  }

}