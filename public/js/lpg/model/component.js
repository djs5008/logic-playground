/* global createjs,uuid */
define(() => {
  'use strict';

  class Component {

    /**
     * General Component constructor
     * @param bounds 
     *    A createjs.Point instance representing the real-valued bounds of this component
     */
    constructor(type, superType, bounds) {
      this.label = '';
      this.type = type;
      this.superType = superType;
      this.bounds = bounds;
      this.connectors = [];
      this.id = (this.id) ? this.id : uuid();
    }

    /**
     * Default Component paint prototype
     */
    paint() {  }

    /**
     * Default Component settings loader
     * 
     * @param elem The DOM element the settings are being loaded into
     */
    loadSettings(elem) {
      elem.html('');
    }

    /**
     * Move this component to the specified coordinates
     *  This is a repositioning type of move.
     *  Use move() to move this component relative to its current position
     * 
     * @param {number} x 
     * @param {number} y 
     */
    moveTo(x, y) {
      const lastX = this.bounds.x;
      const lastY = this.bounds.y;

      // update this components bounds
      this.bounds.x = x;
      this.bounds.y = y;

      var diffX = (this.bounds.x - lastX);
      var diffY = (this.bounds.y - lastY);

      // update all of this components connectors bounds
      this.connectors.forEach((connector) =>  {
        connector.moveTo(
          connector.bounds.x + diffX,
          connector.bounds.y + diffY
        );
      });
    }

    /**
     * Move this component to the specified coordinates relative to it's current position
     *  This is a relative type of move.
     *  Use moveTo() to absolutely position this component
     * 
     * @param {number} x 
     * @param {number} y 
     */
    move(x, y) {
      this.moveTo(this.bounds.x + x, this.bounds.y + y);
    }

    /**
     * Retrieve the list of connectors for this component
     */
    getConnectors() {
      return this.connectors;
    }

    /**
     * Retrieve the list of only output-type connectors for this component
     */
    getOutputConnectors() {
      var outputConns = [];
      this.connectors.forEach((conn) => {
        if (conn.isOutput()) {
          outputConns.push(conn);
        }
      });
      return outputConns;
    }

    /**
     * Retrieve the list of only input-type connectors for this component
     */
    getInputConnectors() {
      var inputConns = [];
      this.connectors.forEach((conn) => {
        if (conn.isInput()) {
          inputConns.push(conn);
        }
      });
      return inputConns;
    }

    /**
     * Check if the component is a Gate-type component
     */
    isGate() {
      return this.superType === 'GATE';
    }

    /**
     * Check if the component is an Output-type component
     */
    isOutputComp() {
      return this.superType === 'OUTPUT';
    }

    /**
     * Check if the component is an Input-type component
     */
    isInputComp() {
      return this.superType === 'INPUT';
    }

    /**
     * Default right-click down behavior
     */
    rightClickDownEvent() { }

    /**
     * Default left-click down behavior
     */
    leftClickDownEvent() { }

    /**
     * Default right-click up behavior
     */
    rightClickUpEvent() { }

    /**
     * Default left-click up behavior
     */
    leftClickUpEvent() { }

    /**
     * Default double-click (left) behavior
     */
    doubleClickEvent() { }

    /**
     * Export this component to an data-url image
     * 
     * @returns the data-url of the processed image
     */
    exportImage() {
      var compShape = new createjs.Shape();
      var graphics = compShape.graphics;
      const cachePadding = 10;

      this.paint(graphics, { x: cachePadding / 2, y: cachePadding / 2 });

      compShape.cache(0, 0, this.bounds.width + cachePadding, this.bounds.height + cachePadding);
      var url = compShape.bitmapCache.getCacheDataURL();
      
      return url;
    }
  }

  return Component;
});