// 
// Includes
// 
import { Component } from '../component'; 

// 
// Constants
// 

// 
// Attributes
// 

export class Gate extends Component {

  /**
   * Construct a Gate-type component
   * 
   * @param {string} type 
   * @param {string} superType 
   * @param {createjs.Rectangle} bounds 
   */
  constructor(type, superType, bounds) {
    super(type, superType, bounds);
  }

  /**
   * Default Gate propagate prototype function
   */
  propagate() { }
}