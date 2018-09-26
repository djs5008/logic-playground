// 
// Includes
// 
import { Connector } from '../misc/connector';
import { Input } from '../../types/input';

// 
// Constants
// 
const BUTTON_WIDTH = 20;
const BUTTON_HEIGHT = 30;
var slideAmounts = {};

export class SwitchButton extends Input {

  /**
   * SwitchButton Constructor
   * 
   * @param {createjs.Rectangle} bounds 
   */
  constructor(bounds) {
    super('SWITCH-BUTTON', 'INPUT', bounds, true);

    this.bounds.width = BUTTON_WIDTH;
    this.bounds.height = BUTTON_HEIGHT;

    var output = new Connector(
      {
        x: this.bounds.x + BUTTON_WIDTH + (BUTTON_WIDTH / 2),
        y: this.bounds.y + (BUTTON_HEIGHT / 2)
      },
      'OUTPUT'
    );
    this.connectors.push(output);
    slideAmounts[this.id] = 0.0;
  }

  /**
   * Toggle hold-button state on right click down
   */
  rightClickUpEvent() {
    this.setState(!this.getState());
  }

  /**
   * Set the amount of slide for this switches toggle bar
   * 
   * @param {number} amount 0 <= amount <= 1
   */
  setSlideAmount(amount) {
    slideAmounts[this.id] = amount;
  }

  /**
   * Paint the component
   * 
   * @param {createjs.Graphics} graphics The graphics object being painted to
   * @param {createjs.Point} screenLoc The canvas location of the paint procedure
   */
  paint(graphics, screenLoc) {
    const ON_COLOR = 'rgb(0,200,0)';
    const OFF_COLOR = 'rgb(200,0,0)';
    let me = this;
    let slideAmount = slideAmounts[this.id];

    const PADDING = 2;
    const HALF_PADDING = PADDING / 2;
    const SWITCH_HEIGHT = this.bounds.height / 2;

    // Draw output connectors
    this.getOutputConnectors().forEach((conn) => {
      let xDiff = conn.bounds.x - me.bounds.x;
      let yDiff = conn.bounds.y - me.bounds.y;
      graphics
        .beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .moveTo((screenLoc.x + me.bounds.width), screenLoc.y + yDiff)
        .lineTo(screenLoc.x + xDiff, screenLoc.y + yDiff)
        .endStroke()
        .setStrokeStyle();
    });

    graphics
      .beginStroke('black')
      .setStrokeStyle(PADDING)
      .drawRect(screenLoc.x, screenLoc.y, this.bounds.width, this.bounds.height)
      .endStroke()
      .setStrokeStyle();
    
    // Draw on color half
    graphics
      .beginFill(ON_COLOR)
      .drawRect(screenLoc.x + (HALF_PADDING), screenLoc.y + (HALF_PADDING), this.bounds.width - PADDING, (this.bounds.height / 2))
      .endFill();

    // Draw off color half
    graphics
      .beginFill(OFF_COLOR)
      .drawRect(screenLoc.x + (HALF_PADDING), screenLoc.y+ (this.bounds.height / 2), this.bounds.width - PADDING, (this.bounds.height / 2) - HALF_PADDING)
      .endFill();

    let onLocY = screenLoc.y;
    let offLocY = this.bounds.height - SWITCH_HEIGHT;

    graphics.beginFill('rgb(0,0,0,0.9)');

    // Draw "on" switch style 
    if (this.getState()) {
      graphics
        .drawRect(
          screenLoc.x,
          onLocY + (offLocY * slideAmount),
          this.bounds.width,
          SWITCH_HEIGHT);
    } 
    
    // Draw "off" switch style
    else {
      graphics
        .drawRect(
          screenLoc.x, 
          onLocY + (offLocY * slideAmount), 
          this.bounds.width, 
          SWITCH_HEIGHT);
    }

    graphics.endFill();
  }
}