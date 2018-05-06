define(() => {
  'use strict';

  class HoverConnectorState {

    constructor(context, hoveredConn) {
      this.context = context;
      this.hoveredConn = hoveredConn;
      this.hoveredSSD = null;
    }

    /**
     * Handle mouse movement events
     */
    handleMouseMove() {
      let hoveredConn = this.context.getHoveredConnector();

      // Highlight hovered connector state on SEVEN-SEG-DISP
      // TODO : change this to be less-specific
      if (hoveredConn !== null) {
        if (hoveredConn !== this.hoveredConn) {
          this.context.setActiveState('HOVER-CONNECTOR', hoveredConn);
          return;
        } 
        let hoveredConnComp = this.context.moduleController.activeModule.getComponent(hoveredConn);
        if (hoveredConnComp !== null && hoveredConnComp.type === 'SEVEN-SEG-DISP') {
          hoveredConnComp.setHoveredConnector(hoveredConn);
          this.hoveredSSD = hoveredConnComp;
        }
      } else {
        // Reset SEVEN-SEG-DISP hovered state
        if (this.hoveredSSD !== null) {
          this.hoveredSSD.setHoveredConnector(null);
          this.hoveredSSD = null;
        }

        this.context.setActiveState('EMPTY');
      }
    }

    /**
     * Handle left-click mouse dragging
     */
    handleMouseDragLeft() {
      this.context.setActiveState('CONNECTING', this.hoveredConn);
    }

    /**
     * Handle right-click mouse dragging
     */
    handleMouseDragRight() {
      this.context.setActiveState('PANNING');
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
    handleLeftClickUp() {
      this.context.setActiveState('CONNECTING', this.hoveredConn);
    }

    /**
     * Handle right-click up events
     */
    handleRightClickUp() {
      this.context.moduleController.breakConnections(this.hoveredConn);
    }

    /**
     * Handle double-click events
     */
    handleDoubleClick() {}

  }

  return HoverConnectorState;

});