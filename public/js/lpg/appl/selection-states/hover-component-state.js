define(() => {
  'use strict';

  class HoverComponentState {

    constructor(context, hoveredComp) {
      this.context = context;
      this.hoveredComp = hoveredComp;
    }

    /**
     * Handle mouse movement events
     */
    handleMouseMove() {
      let hoveredComp = this.context.getHoveredComponent();
      if (hoveredComp === null) {
        this.context.setActiveState('EMPTY');
      } else if (hoveredComp != this.hoveredComp) {
        this.context.setActiveState('HOVER-COMPONENT', hoveredComp);
      }
    }

    /**
     * Handle left-click mouse dragging
     */
    handleMouseDragLeft() {}

    /**
     * Handle right-click mouse dragging
     */
    handleMouseDragRight() {
      this.context.setActiveState('PANNING');
    }

    /**
     * Handle left-click down events
     */
    handleLeftClickDown() {
      // allow single piece selections
      if (!this.context.selectedComponents.includes(this.hoveredComp)) {
        this.context.selectedComponents = [this.hoveredComp];
      }
      this.context.setActiveState('DRAGGING');
    }

    /**
     * Handle right-click down events
     */
    handleRightClickDown() {
      this.hoveredComp.rightClickDownEvent();
    }

    /**
     * Handle left-click up events
     */
    handleLeftClickUp() {}

    /**
     * Handle right-click up events
     */
    handleRightClickUp() {
      this.hoveredComp.rightClickUpEvent();
    }

    /**
     * Handle double-click events
     */
    handleDoubleClick() {}

  }

  return HoverComponentState;

});