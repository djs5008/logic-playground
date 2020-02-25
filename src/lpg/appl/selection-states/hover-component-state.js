import { ControlState, States } from './control-state';
import { store } from '../../../store/store';
import { addActiveModule } from '../../../actions/actions';

export class HoverComponentState extends ControlState {

  constructor(context, hoveredComp) {
    super(context);
    this.hoveredComp = hoveredComp;
  }

  /**
   * Handle mouse movement events
   */
  handleMouseMove() {
    let hoveredComp = this.context.getHoveredComponent();
    if (hoveredComp === null) {
      this.context.setActiveState(States.EMPTY);
    } else if (hoveredComp !== this.hoveredComp) {
      this.context.setActiveState(States.HOVER_COMPONENT, hoveredComp);
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
    this.context.setActiveState(States.PANNING);
  }

  /**
   * Handle left-click down events
   */
  handleLeftClickDown() {
    // allow single piece selections
    if (!this.context.selectedComponents.includes(this.hoveredComp)) {
      this.context.selectedComponents = [this.hoveredComp];
    }
    this.context.setActiveState(States.DRAGGING);
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
        // Push an active module and set it as active
        store.dispatch(addActiveModule(selectedComponent));

        // Reset component selections
        this.context.clearSelection();
      }
    }
  }

}