/* global createjs */
define((require) => {
  'use strict';

  // 
  // Includes
  // 
  const Gate = require('model/types/gate');
  const Connector = require('model/types/misc/connector');
  const Logic = require('model/logic');

  //
  // Attributes
  // 
  let image = null;

  class ORGate extends Gate {

    /**
     * ORGate Constructor
     * 
     * @param {createjs.Rectangle} bounds 
     */
    constructor(bounds, img) {
      super('OR-GATE', 'GATE', bounds);
      image = (image === null) ? img : image;
      this.setupGate();
    }

    setupGate() {
      if (this.connectors.length === 0) {
        this.bounds.width = image.width;
        this.bounds.height = image.height;

        // setup connectors
        const inputOffset = 11; // Comes from image size
        var input1 = new Connector({ x: this.bounds.x, y: this.bounds.y + inputOffset }, 'INPUT');
        var input2 = new Connector({ x: this.bounds.x, y: (this.bounds.y + this.bounds.height) - inputOffset }, 'INPUT');
        var output = new Connector({ x: this.bounds.x + this.bounds.width, y: this.bounds.y + (this.bounds.height / 2) }, 'OUTPUT');
        this.connectors.push(input1, input2, output);
      }

      // initialize gate
      this.propagate();
    }

    /**
     * Override propagate functionality
     */
    propagate() {
      var input1 = this.connectors[0];
      var input2 = this.connectors[1];
      var output = this.connectors[2];
      output.updateState(Logic.orr(input1.getState(), input2.getState()));
    }

    /**
     * Paint the component
     * 
     * @param {createjs.Graphics} graphics The graphics object being painted to
     * @param {createjs.Point} canvasLoc The canvas location of the paint procedure
     */
    paint(graphics, canvasLoc) {
      // create and translate matrix to offset comp's x and y
      var matrix = new createjs.Matrix2D();
      matrix.translate(canvasLoc.x, canvasLoc.y);

      // set fill to image bitmap, fill image
      graphics.beginBitmapFill(image, 'no-repeat', matrix)
        .drawRect(canvasLoc.x, canvasLoc.y, image.width, image.height)
        .endFill();
    }
  }

  return ORGate;
});