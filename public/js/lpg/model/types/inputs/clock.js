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
  const DEFAULT_INTERVAL = 2000;

  class Clock extends Input {

    /**
     * Clock Constructor
     * 
     * @param {*} bounds 
     */
    constructor(bounds) {
      super('CLOCK', 'INPUT', bounds, false);

      this.bounds.width = BUTTON_RADIUS;
      this.bounds.height = BUTTON_RADIUS;

      this.interval = DEFAULT_INTERVAL;
      this.nextTick = Date.now() + this.interval;

      var output = new Connector(
        {
          x: this.bounds.x + BUTTON_RADIUS + ((BUTTON_RADIUS / 2) * (2 / 3)),
          y: this.bounds.y + (BUTTON_RADIUS / 2)
        },
        'OUTPUT'
      );
      this.connectors.push(output);

      // Begin clock timer
      this.start();
    }

    /**
     * Start the Clock's timer
     */
    start() {
      var me = this;
      setInterval(function () {
        if (me.nextTick < Date.now()) {
          me.nextTick = Date.now() + me.interval;
          me.connectors[0].updateState(!me.connectors[0].getState());
        }
      }, 1);
    }

    /**
     * Paint the component
     * 
     * @param {createjs.Graphics} graphics The graphics object being painted to
     * @param {createjs.Point} screenLoc The canvas location of the paint procedure
     */
    paint(graphics, screenPos) {
      var centerX = screenPos.x + (BUTTON_RADIUS / 2);
      var centerY = screenPos.y + (BUTTON_RADIUS / 2);
      var activeColor = (this.getState()) ? 'rgb(0,200,0)' : 'rgb(200,0,0)';
      var inactiveColor = (this.getState()) ? 'rgb(200,0,0)' : 'rgb(0,200,0)';

      var angle = (Math.PI * 2) * ((this.nextTick - Date.now()) / this.interval);

      // Draw connector line
      graphics.beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .moveTo(centerX, centerY)
        .lineTo(centerX + ((BUTTON_RADIUS / 2) * (3 / 2)), centerY)
        .endStroke()
        // Draw current state
        .beginFill(activeColor)
        .drawCircle(centerX, centerY, BUTTON_RADIUS / 2)
        .endFill()
        // Draw time-left arc
        .setStrokeStyle(BUTTON_RADIUS / 2)
        .beginStroke(inactiveColor)
        .arc(centerX, centerY, BUTTON_RADIUS / 4, 0, angle, false)
        .endStroke()
        .setStrokeStyle()
        // Draw outline
        .setStrokeStyle(2)
        .beginStroke('rgb(0,0,0)')
        .drawCircle(centerX, centerY, BUTTON_RADIUS / 2)
        .endStroke()
        // Draw center area
        .beginFill('rgb(0,0,0)')
        .drawCircle(centerX, centerY, BUTTON_RADIUS / 3)
        .endFill()
        .setStrokeStyle();
    }
  }

  return Clock;
});