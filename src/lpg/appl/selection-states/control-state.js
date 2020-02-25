/**
 * A "blank" ControlState object
 */
export class ControlState {

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
  handleLeftClickUp() {}

  /**
   * Handle right-click up events
   */
  handleRightClickUp() {}

  /**
   * Handle double-click events
   */
  handleDoubleClick() {}

};

/**
 * Map of States used by SelectionController
 */
export const States = {
  EMPTY: 'EMPTY',
  PANNING: 'PANNING',
  DRAGGING: 'DRAGGING',
  HOVER_COMPONENT: 'HOVER_COMPONENT',
  HOVER_CONNECTOR: 'HOVER_CONNECTOR',
  SELECTING: 'SELECTING',
  CONNECTING: 'CONNECTING',
};