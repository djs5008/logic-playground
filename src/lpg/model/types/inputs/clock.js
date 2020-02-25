// 
// Includes
// 
import Connector from '../misc/connector';
import Input from '../../types/input';
import React from 'react';
import { store } from '../../../../store/store.js';
import { addComponentSetting } from '../../../../actions/actions';
import ControlButton from '../../../../components/control-button';

// 
// Constants
// 
const BUTTON_RADIUS = 30;
const DEFAULT_INTERVAL = 1000;

export default class Clock extends Input {

  /**
   * Clock Constructor
   * 
   * @param {createjs.Rectangle} bounds 
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
    setInterval(() =>  {
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

  /**
   * LED Component settings loader
   */
  loadSettings() {
    super.loadSettings();
    let me = this;
    let clockControlID = 'clock-timer-control';

    let clockControlHTML = (
      <ControlButton
        id={clockControlID}
        type='button'
        value='Set Interval'
        onClick={() => {
          let promptVal = prompt('Set new interval (ms): ', me.interval);
          let val = parseInt(promptVal);
          if (promptVal !== null) {
            if (!isNaN(val) && isFinite(val)) {
              me.interval = parseInt(val, 10);
              me.nextTick = Date.now() + me.interval;
            } else {
              alert(promptVal + ' is not a number!');
            }
          }
        }}
      />
    );

    store.dispatch(addComponentSetting(clockControlHTML));
  }
}