define(function (require) {
  'use strict';

  // 
  // Includes
  // 
  var Input = require('model/types/input');
  var Connector = require('model/types/misc/connector');

  // 
  // Constants
  // 
  const BUTTON_RADIUS = 30;

  class SwitchButton extends Input {

    /**
     * SwitchButton Constructor
     * 
     * @param {createjs.Rectangle} bounds 
     */
    constructor(bounds) {
      super('SWITCH-BUTTON', 'INPUT', bounds, true);

      this.bounds.width = BUTTON_RADIUS;
      this.bounds.height = BUTTON_RADIUS;

      var output = new Connector(
        {
          x: this.bounds.x + BUTTON_RADIUS + ((BUTTON_RADIUS / 2) * (2 / 3)),
          y: this.bounds.y + (BUTTON_RADIUS / 2)
        },
        'OUTPUT'
      );
      this.connectors.push(output);
    }

    /**
     * Paint the component
     * 
     * @param {createjs.Graphics} graphics The graphics object being painted to
     * @param {createjs.Point} screenLoc The canvas location of the paint procedure
     */
    paint(graphics, screenLoc) {
      var centerX = screenLoc.x + (BUTTON_RADIUS / 2);
      var centerY = screenLoc.y + (BUTTON_RADIUS / 2);
      var color = (this.getState()) ? 'rgb(0,200,0)' : 'rgb(200,0,0)';
      graphics.beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .moveTo(centerX, centerY)
        .lineTo(centerX + ((BUTTON_RADIUS / 2) * (3 / 2)), centerY)
        .endStroke()
        .beginFill(color)
        .drawCircle(centerX, centerY, BUTTON_RADIUS / 2)
        .endFill()
        .beginStroke('rgb(0,0,0)')
        .drawCircle(centerX, centerY, BUTTON_RADIUS / 2)
        .endStroke()
        .setStrokeStyle();
    }
  }

  return SwitchButton;
});