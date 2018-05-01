/* global createjs */
define(() => {
  'use strict';

  class PanningState {

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
    handleMouseDragLeft() {}

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
    handleLeftClickUp() {}

    /**
     * Handle right-click up events
     */
    handleRightClickUp() {
      this.context.setActiveState('EMPTY');
    }

    /**
     * Handle double-click events
     */
    handleDoubleClick() {}

  }

  return PanningState;

});