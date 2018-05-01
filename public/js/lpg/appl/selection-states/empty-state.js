/* global createjs,$ */
define(() => {
  'use strict';

  class EmptyState {

    constructor(context) {
      this.context = context;
    }
    
    /**
     * Handle mouse movement events
     */
    handleMouseMove() {
      let hoveredConn = this.context.getHoveredConnector();
      let hoveredComp = this.context.getHoveredComponent();

      if (hoveredConn !== null) {
        this.context.setActiveState('HOVER-CONNECTOR', hoveredConn);
      } else if (hoveredComp !== null) {
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
    handleMouseDragRight() {}

    /**
     * Handle left-click down events
     */
    handleLeftClickDown() {
      this.context.selectionRect = new createjs.Rectangle(this.context.clickPos.x, this.context.clickPos.y, 0, 0);
      this.context.setActiveState('SELECTING');
    }

    /**
     * Handle right-click down events
     */
    handleRightClickDown() {
      this.context.setActiveState('PANNING');
    }

    /**
     * Handle left-click up events
     */
    handleLeftClickUp() {}

    /**
     * Handle right-click up events
     */
    handleRightClickUp() {}

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

  return EmptyState;

});