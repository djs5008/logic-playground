// 
// Includes
// 
import { Connector } from '../misc/connector';
import { Output } from '../../types/output';

// 
// Constants
// 
const LED_RADIUS = 25;
const DEFAULT_COLOR = '#00FF00';

export class LED extends Output {

  /**
   * LED Constructor
   * 
   * @param {createjs.Rectangle} bounds 
   */
  constructor(bounds) {
    super('LED', 'OUTPUT', bounds);

    this.bounds.width = LED_RADIUS;
    this.bounds.height = LED_RADIUS;
    this.color = (this.color) ? this.color : DEFAULT_COLOR;

    var output = new Connector(
      {
        x: this.bounds.x - ((LED_RADIUS / 2) * (2 / 3)),
        y: this.bounds.y + (LED_RADIUS / 2)
      },
      'INPUT');
    this.connectors.push(output);
  }

  /**
   * Modify a color value to lighten/darken it
   * 
   * @param {string} col The color value being modified 
   * @param {number} amt The percent amount to modify the color by
   */
  lightenDarkenColor(col, amt) {
    var usePound = false;
    if ((usePound = (col[0] === '#'))) {
      col = col.slice(1);
    }

    let clampRGB = function(val) {
      return Math.ceil((val > 255) ? 255 : ((val < 0) ? 0 : val));
    };

    var num = parseInt(col, 16);

    var r = ((num >> 16) & 0xFF) * amt;
    var g = ((num >>  8) & 0xFF) * amt;
    var b = ((num >>  0) & 0xFF) * amt;
    
    r = clampRGB(r);
    g = clampRGB(g);
    b = clampRGB(b);

    return (usePound ? '#' : '') + String('000000' + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
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
    var halfColor = this.lightenDarkenColor(this.color, 0.5);
    var qtrColor = this.lightenDarkenColor(this.color, 0.25);
    var baseColor = (this.getState()) ? halfColor : qtrColor;
    var lightColor = (this.getState()) ? this.color : halfColor;
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

  /**
   * LED Component settings loader
   * 
   * @param elem The DOM element the settings are being loaded into
   */
  loadSettings(elem) {
    super.loadSettings(elem);
    let me = this;
    let colorPickerID = 'led-color-picker';
    let colorControlID = 'led-color-control';
    let colorPickerHTML = '<input id="' + colorPickerID + '" type="color" style="display:none;">';
    let colorControlHTML = '<input id="' + colorControlID + '" type="button" value="Set Color" style="color:' + this.color + ';">';
    
    elem.append(colorPickerHTML);
    elem.append(colorControlHTML);
    $('#' + colorControlID).addClass('controls');

    $('#' + colorControlID).on('click', () => {
      $('#' + colorPickerID).get(0).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    });

    $('#' + colorPickerID).on('change', (event) => {
      me.color = event.target.value;
      $('#' + colorControlID).css('color', me.color);
    });
  }
}