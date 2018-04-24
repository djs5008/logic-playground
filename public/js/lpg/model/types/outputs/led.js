define((require) => {
  'use strict';

  // 
  // Includes
  // 
  var Output = require('model/types/output');
  var Connector = require('model/types/misc/connector');

  // 
  // Constants
  // 
  const LED_RADIUS = 25;

  class LED extends Output {

    /**
     * LED Constructor
     * 
     * @param {createjs.Rectangle} bounds 
     */
    constructor(bounds) {
      super('LED', 'OUTPUT', bounds);

      this.bounds.width = LED_RADIUS;
      this.bounds.height = LED_RADIUS;

      var output = new Connector(
        {
          x: this.bounds.x - ((LED_RADIUS / 2) * (2 / 3)),
          y: this.bounds.y + (LED_RADIUS / 2)
        },
        'INPUT');
      this.connectors.push(output);
    }

    /**
     * Paint the component
     * 
     * @param {createjs.Graphics} graphics The graphics object being painted to
     * @param {createjs.Point} screenLoc The canvas location of the paint procedure
     */
    paint(graphics, screenLoc) {
      var centerX = screenLoc.x + (LED_RADIUS / 2);
      var centerY = screenLoc.y + (LED_RADIUS / 2);
      var baseColor = (this.getState()) ? 'rgb(0,100,0)' : 'rgb(100,0,0)';
      var lightColor = (this.getState()) ? 'rgb(0,255,0)' : 'rgb(150,0,0)';
      var lightRatios = [1, 0];
      // Connector Stroke
      graphics.beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .moveTo(centerX, centerY)
        .lineTo(centerX - ((LED_RADIUS / 2) * (3 / 2)), centerY)
        .endStroke()
        // Base Color fill
        .beginFill(baseColor)
        .drawCircle(centerX, centerY, LED_RADIUS / 2)
        .endFill()
        // Light Color fill
        .beginRadialGradientFill(['rgba(0,0,0,0)', lightColor], lightRatios, centerX, centerY, 0, centerX, centerY, LED_RADIUS)
        .drawCircle(centerX, centerY, LED_RADIUS / 2)
        .endFill()
        // Outline Stroke
        .beginStroke('rgb(0,0,0)')
        .setStrokeStyle(1)
        .drawCircle(centerX, centerY, LED_RADIUS / 2)
        .endStroke()
        .setStrokeStyle();
    }
  }

  return LED;
});