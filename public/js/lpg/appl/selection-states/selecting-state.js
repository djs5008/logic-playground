/* global createjs */
define(() => {
  'use strict';

  class SelectingState {

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
    handleMouseDragLeft() {
      // maintain finalize list of selected components while selecting
      let mousePos = this.context.mousePos;
      let clickPos = this.context.clickPos;
      this.context.selectedComponents = this.context.getSelectedComponents();
      this.context.selectionRect = new createjs.Rectangle(
        ((mousePos.x > clickPos.x) ? clickPos.x : mousePos.x),
        ((mousePos.y > clickPos.y) ? clickPos.y : mousePos.y),
        ((mousePos.x > clickPos.x) ? mousePos.x - clickPos.x : clickPos.x - mousePos.x),
        ((mousePos.y > clickPos.y) ? mousePos.y - clickPos.y : clickPos.y - mousePos.y)
      );
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

      this.context.setActiveState('EMPTY');
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

  return SelectingState;

});