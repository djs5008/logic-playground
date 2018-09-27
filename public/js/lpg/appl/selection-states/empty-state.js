import { ControlState, States } from './control-state';

export class EmptyState extends ControlState {

  constructor(context) {
    super(context);
  }
  
  /**
   * Handle mouse movement events
   */
  handleMouseMove() {
    let hoveredConn = this.context.getHoveredConnector();
    let hoveredComp = this.context.getHoveredComponent();

    if (hoveredConn !== null) {
      this.context.setActiveState(States.HOVER_CONNECTOR, hoveredConn);
    } else if (hoveredComp !== null) {
      this.context.setActiveState(States.HOVER_COMPONENT, hoveredComp);
    }
  }

  /**
   * Handle left-click down events
   */
  handleLeftClickDown() {
    this.context.selectionRect = new createjs.Rectangle(this.context.clickPos.x, this.context.clickPos.y, 0, 0);
    this.context.setActiveState(States.SELECTING);
  }

  /**
   * Handle right-click down events
   */
  handleRightClickDown() {
    this.context.setActiveState(States.PANNING);
  }
  
}