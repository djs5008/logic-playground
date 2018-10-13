// 
// Includes
//
import { Connector } from '../misc/connector';
import { Output } from '../../types/output';

// 
// Constants
// 
const WIDTH = 60;
const HEIGHT = 100;

var hoveredConnector = null;

export class SevenSegDisp extends Output {

  /**
   * SevenSegDisp Constructor
   * 
   * @param {createjs.Rectangle} bounds 
   */
  constructor(bounds) {
    super('SEVEN-SEG-DISP', 'OUTPUT', bounds);

    this.bounds.width = WIDTH;
    this.bounds.height = HEIGHT;

    // Add 7 input connectors
    var yOff = (this.bounds.height / 7) / 2;
    var x = this.bounds.x - (this.bounds.width / 5);

    for (var i = 0; i < 7; i++) {
      var y = this.bounds.y + yOff + ((this.bounds.height / 7) * i);
      var conn = new Connector(new window.createjs.Rectangle(x, y, 0, 0), 'INPUT');
      this.connectors.push(conn);
    }
  }

  /**
   * Retrieve the state of a specific connector based on it's index
   * 
   * @param {number} connIndex The index used to retrieve the Connector
   */
  getStateIndex(connIndex) {
    return this.connectors[connIndex].getState();
  }

  /**
   * Set the hovered connector to display which segment it's associated with
   * 
   * @param {number} connector The connector being hovered
   */
  setHoveredConnector(connector) {
    hoveredConnector = connector;
  }

  /**
   * Paint the component
   * 
   * @param {createjs.Graphics} graphics The graphics object being painted to
   * @param {createjs.Point} screenLoc The canvas location of the paint procedure
   */
  paint(graphics, screenLoc) {

    const SEG_LENGTH = this.bounds.width * (2 / 3);
    const SEG_HEIGHT = this.bounds.height / 10;
    const SEG_CORNER_DIST = (this.bounds.width / 12);

    let hovered = (hoveredConnector !== null && this.connectors.includes(hoveredConnector));

    // Draw connector lines
    var yOff = (this.bounds.height / 7) / 2;
    var x = screenLoc.x - (this.bounds.width / 5);
    for (var i = 0; i < 7; i++) {
      var y = screenLoc.y + yOff + ((this.bounds.height / 7) * i);
      graphics.beginStroke('black')
        .setStrokeStyle(2)
        .moveTo(x, y)
        .lineTo(screenLoc.x, y)
        .setStrokeStyle()
        .endStroke();
    }

    // Draw background
    graphics.beginStroke('rgba(0,0,0,0.9)')
      .setStrokeStyle(2)
      .beginFill('rgba(0,0,0,0.8)')
      .moveTo(screenLoc.x, screenLoc.y)
      .drawRect(screenLoc.x, screenLoc.y, this.bounds.width, this.bounds.height)
      .setStrokeStyle()
      .endStroke()
      .endFill();

    // Draw each horizontal segment
    var ySegOff = ((this.bounds.height - (SEG_HEIGHT)) / 2) - (SEG_HEIGHT / 2);
    x = screenLoc.x + ((this.bounds.width / 3) - SEG_HEIGHT);
    for (i = 0; i < 3; i++) {
      y = screenLoc.y + (ySegOff * i) + SEG_HEIGHT;
      var color = (this.getStateIndex(3 * i)) ? 'rgba(0,255,0,0.7)' : 'rgba(255,255,255,0.25)';
      if (hovered && hoveredConnector === this.connectors[3 * i]) {
        color = 'rgba(255,50,255,0.7)';
      }
      graphics.beginFill(color)
        .moveTo(x, y)
        .lineTo(x + SEG_CORNER_DIST, y + (SEG_HEIGHT / 2))
        .lineTo(x + (SEG_LENGTH - SEG_CORNER_DIST), y + (SEG_HEIGHT / 2))
        .lineTo(x + SEG_LENGTH, y)
        .lineTo(x + (SEG_LENGTH - SEG_CORNER_DIST), y - (SEG_HEIGHT / 2))
        .lineTo(x + SEG_CORNER_DIST, y - (SEG_HEIGHT / 2))
        .lineTo(x, y)
        .endFill();
    }

    // Draw each vertical segment
    var baseX = screenLoc.x + ((this.bounds.width / 3) - SEG_HEIGHT);
    var baseY = screenLoc.y + SEG_HEIGHT;
    for (i = 0; i < 4; i++) {
      x = (i % 2 !== 0) ? baseX : (baseX + SEG_LENGTH);
      y = (i < 2) ? baseY : (baseY + SEG_LENGTH);
      var index = (i === 0) ? 1 : (i === 1) ? 2 : (i === 2) ? 4 : (i === 3) ? 5 : -1;
      color = (this.getStateIndex(index)) ? 'rgba(0,255,0,0.7)' : 'rgba(255,255,255,0.25)';
      if (hovered && hoveredConnector === this.connectors[index]) {
        color = 'rgba(255,50,255,0.7)';
      }
      graphics.beginFill(color)
        .moveTo(x, y)
        .lineTo(x + (SEG_HEIGHT / 2), y + SEG_CORNER_DIST)
        .lineTo(x + (SEG_HEIGHT / 2), y + (SEG_LENGTH - SEG_CORNER_DIST))
        .lineTo(x, y + SEG_LENGTH)
        .lineTo(x - (SEG_HEIGHT / 2), y + (SEG_LENGTH - SEG_CORNER_DIST))
        .lineTo(x - (SEG_HEIGHT / 2), y + SEG_CORNER_DIST)
        .lineTo(x, y)
        .endFill();
    }
  }
}