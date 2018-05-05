define((require) => {
  'use strict';

  // 
  // Includes
  // 
  var Input = require('model/types/input');
  var Connector = require('model/types/misc/connector');

  // 
  // Constants
  // 
  const BUTTON_WIDTH = 20;
  const BUTTON_HEIGHT = 30;
  var slideAmounts = {};

  class SwitchButton extends Input {

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
     * Paint the component
     * 
     * @param {createjs.Graphics} graphics The graphics object being painted to
     * @param {createjs.Point} screenLoc The canvas location of the paint procedure
     */
    paint(graphics, screenLoc) {
      let color = (this.getState()) ? 'rgb(0,200,0)' : 'rgb(200,0,0)';
      let me = this;

      const PADDING = 2;
      const HALF_PADDING = PADDING / 2;
      const SWITCH_HEIGHT = this.bounds.height / 2;
      const LERP_DELTA = 0.1;

      // Lerp slide bar
      let slideAmount = slideAmounts[this.id];
      if (this.getState()) {
        slideAmount = (slideAmount < 1.0) ? slideAmount + LERP_DELTA : 1.0;
      } else {
        slideAmount = (slideAmount > 0.0) ? slideAmount - LERP_DELTA : 0.0;
      }
      slideAmounts[this.id] = slideAmount;

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
      graphics
        .beginFill(color)
        .drawRect(screenLoc.x + (HALF_PADDING), screenLoc.y + (HALF_PADDING), this.bounds.width - PADDING, this.bounds.height - PADDING)
        .endFill();

      let onLocY = screenLoc.y;
      let offLocY = this.bounds.height - SWITCH_HEIGHT;

      graphics.beginFill('rgb(0,0,0,0.8)');

      // Draw "on" switch style 
      if (this.getState()) {
        graphics
          .drawRect(
            screenLoc.x + (HALF_PADDING),
            onLocY + (offLocY * slideAmount),
            this.bounds.width - PADDING,
            SWITCH_HEIGHT);
      } 
      
      // Draw "off" switch style
      else {
        graphics
          .drawRect(
            screenLoc.x + (HALF_PADDING), 
            onLocY + (offLocY * slideAmount), 
            this.bounds.width - PADDING, 
            SWITCH_HEIGHT);
      }

      graphics.endFill();
    }
  }

  return SwitchButton;
});