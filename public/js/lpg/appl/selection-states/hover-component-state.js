/* global $ */
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
    handleDoubleClick() {
      if (this.context.selectedComponents.length === 1) {
        let selectedComponent = this.context.selectedComponents[0];
        if (selectedComponent.type === 'MODULE') {
          // Add active module to stack of current modules
          this.context.moduleController.activeModules.push(this.context.moduleController.activeModule);

          // Set active module
          this.context.moduleController.activeModule = selectedComponent;

          // Reset component selections
          this.context.clearSelection();

          // Set module back button visibility
          $('#module-back-button').css('visibility', 'visible');
          $('#module-nathis.context').val(this.context.moduleController.activeModule.label);
        }
      }
    }

  }

  return HoverComponentState;

});