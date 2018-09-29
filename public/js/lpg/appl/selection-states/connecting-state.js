import { ControlState, States } from './control-state';

export class ConnectingState extends ControlState {

  constructor(context, selectedConn) {
    super(context);
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
   * Handle left-click up events
   */
  handleLeftClickUp() {
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
        otherConn.addConnection(outConn);
        this.context.moduleController.activeModule.updateConnectorMap();
        this.context.selectedConnector = null;
        this.context.setActiveState(States.HOVER_CONNECTOR, hoveredConn);
        return;
      } else if (this.selectedConn === hoveredConn) {
        return;
      }
    }

    this.context.selectedConnector = null;
    this.context.setActiveState(States.EMPTY);
  }

}