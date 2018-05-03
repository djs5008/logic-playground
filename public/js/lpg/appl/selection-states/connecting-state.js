define(() => {
  'use strict';

  class ConnectingState {

    constructor(context, selectedConn) {
      this.context = context;
      this.selectedConn = selectedConn;
      this.context.selectedConnector = selectedConn;
      this.hoveredConn = null;
      this.hoveredSSD = null;
    }

    /**
     * Handle mouse movement events
     */
    handleMouseMove() {
      this.hoveredConn = this.context.getHoveredConnector();

      // Highlight hovered connector state on SEVEN-SEG-DISP
      // TODO : change this to be less-specific
      if (this.hoveredConn !== null) {
        let hoveredConnComp = this.context.moduleController.activeModule.getComponent(this.hoveredConn);
        if (hoveredConnComp !== null && hoveredConnComp.type === 'SEVEN-SEG-DISP') {
          hoveredConnComp.setHoveredConnector(this.hoveredConn);
          this.hoveredSSD = hoveredConnComp;
        }
      } else {
        // Reset SEVEN-SEG-DISP hovered state
        if (this.hoveredSSD !== null) {
          this.hoveredSSD.setHoveredConnector(null);
          this.hoveredSSD = null;
        }
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
      let hoveredConn = this.hoveredConn;
      if (hoveredConn !== null) {
        if (this.selectedConn !== null
          && this.selectedConn !== hoveredConn
          && this.selectedConn.isOutput() !== hoveredConn.isOutput()
          && !this.selectedConn.getConnections().includes(hoveredConn.getID())
          && !hoveredConn.getConnections().includes(this.selectedConn.getID())) {
          // make sure connectors are mapped from output->input
          let outConn = (this.selectedConn.isOutput()) ? this.selectedConn : hoveredConn;
          let otherConn = (outConn === this.selectedConn) ? hoveredConn : this.selectedConn;
          outConn.addConnection(otherConn);
          this.context.selectedConnector = null;
          this.context.setActiveState('EMPTY');
        }
      } else {
        this.context.selectedConnector = null;
        this.context.setActiveState('EMPTY');
      }
    }

    /**
     * Handle right-click down events
     */
    handleRightClickDown() {
      this.context.selectedConnector = null;
      this.context.setActiveState('EMPTY');
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
    handleDoubleClick() {}

  }

  return ConnectingState;

});