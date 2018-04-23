/* global createjs */

define(function (require) {
  'use strict';

  // 
  // Includes
  // 
  var Output = require('model/types/output');
  var Connector = require('model/types/misc/connector');

  // 
  // Constants
  // 
  const CONSOLE_DIM = 25;

  class Console extends Output {

    /**
     * Console Constructor
     * 
     * @param {*} bounds 
     */
    constructor(bounds) {
      super('CONSOLE', 'OUTPUT', bounds);

      this.bounds.width = CONSOLE_DIM;
      this.bounds.height = CONSOLE_DIM;

      var output = new Connector(
        {
          x: this.bounds.x - (this.bounds.width / 2),
          y: this.bounds.y + (this.bounds.height / 2)
        },
        'INPUT'
      );
      this.connectors.push(output);
    }

    // loadStateImage(callback) {

    // }

    /**
     * Paint the component
     * 
     * @param {createjs.Graphics} graphics The graphics object being painted to
     * @param {createjs.Point} screenLoc The canvas location of the paint procedure
     */
    paint(graphics, screenLoc) {
      // var centerX = screenLoc.x + (this.bounds.width / 2);
      var centerY = screenLoc.y + (this.bounds.height / 2);
      var baseColor = 'rgba(0,0,0,0.8)';

      // Connector Stroke
      graphics.beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .moveTo(screenLoc.x, centerY)
        .lineTo(screenLoc.x - (this.bounds.width / 2), centerY)
        .endStroke()

        // Base Color fill
        .beginFill(baseColor)

        // Outline Stroke
        .beginStroke('rgb(0,0,0)')
        .setStrokeStyle(2)
        .drawRect(screenLoc.x, screenLoc.y, this.bounds.width, this.bounds.height)
        .endStroke()
        .endFill()
        .setStrokeStyle();

      // Draw state text
      const stateToBinary = (this.getState()) ? '1' : '0';
      const textStyle = 'bold 20px Courier';
      const fontColor = (this.getState()) ? 'rgb(0,255,0)' : 'rgb(255,0,0)';
      var stateText = new createjs.Text(stateToBinary, textStyle, fontColor);
      stateText.cache(0, 0, this.bounds.width, this.bounds.height);

      var tmpTextImage = new Image(this.bounds.width, this.bounds.height);
      tmpTextImage.src = stateText.bitmapCache.getCacheDataURL();

      // create and translate matrix to offset comp's x and y
      var matrix = new createjs.Matrix2D();
      matrix.translate(
        (screenLoc.x + (this.bounds.width / 2)) - (stateText.getMeasuredWidth() / 2),
        ((screenLoc.y + (this.bounds.height / 2)) - (stateText.getMeasuredLineHeight() / 2))
      );

      graphics.beginBitmapFill(tmpTextImage, 'repeat', matrix)
        .drawRect(screenLoc.x, screenLoc.y, this.bounds.width, this.bounds.height)
        .endFill();
    }
  }

  return Console;
});