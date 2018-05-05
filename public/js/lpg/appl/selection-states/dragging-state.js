/* global createjs */
define(() => {
  'use strict';

  class DraggingState {

    constructor(context) {
      this.context = context;
    }

    /**
     * Handle mouse movement events
     */
    handleMouseMove() {}

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
     * Handle right-click mouse dragging
     */
    handleMouseDragRight() {}

    /**
     * Handle left-click down events
     */
    handleLeftClickDown() {}

    /**
     * Handle right-click down events
     */
    handleRightClickDown() {}

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

    /**
     * Handle right-click up events
     */
    handleRightClickUp() {}

    /**
     * Handle double-click events
     */
    handleDoubleClick() {}

  }

  return DraggingState;

});