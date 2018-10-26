import React from 'react';
import './css/canvas.css';
import BackButton from './back-button';
import { getModuleController, getSelectionController, getDrawController } from '../lpg/core.js';

export default class Canvas extends React.Component {

  /**
   * Retrieve an imported module from sessionStorage that has the current name
   * 
   * @param {*} name The module's label being used to retrieve the module instance
   */
  getImportedModule(name) {
    let result = null;
    JSON.parse(sessionStorage.importedModules).forEach((importedModule) => {
      if (result !== null) return false;
      let mod = JSON.parse(importedModule);
      if (mod.label === name) {
        result = getModuleController().loadModule(mod);
        return false;
      }
    });
    return result;
  }

  /**
   * Allow dragging items over the canvas
   * @param {HTMLEvent} evt 
   */
  handleDragOver(evt) {
    evt.preventDefault();
  }

  /**
   * Allow dropping items on the canvas
   * @param {HTMLEvent} evt 
   */
  handleDrop(evt) {
    evt.preventDefault();
    let data = evt.dataTransfer.getData('text/x-component');
    let rect = evt.target.getBoundingClientRect();
    let dragX = evt.clientX - (rect.left + window.scrollX);
    let dragY = evt.clientY - (rect.top + window.scrollY);
    let loc = getSelectionController().getRealCoords({ x: dragX, y: dragY });
    let bounds = new window.createjs.Rectangle(loc.x, loc.y, 0, 0);
    let component;

    // imported modules
    if (data.includes('imported_')) {
      let name = data.replace('imported_', '');
      component = getModuleController().importModule(this.getImportedModule(name), bounds);
    }
    
    // default components
    else {
      component = getModuleController().addComponent(data, bounds);
    }

    if (component !== null) {
      // call event on component to handle creation
      component.createEvent();
      // shift component to place at center of cursor
      component.move(
        -(component.bounds.width / 2),
        -(component.bounds.height / 2)
      );
    }
  }

  /**
   * Prevent right-clicking on canvas
   * @param {HTMLEvent} evt 
   */
  handleContext(evt) {
    evt.preventDefault();
  }
  
  render() {
    return (
      <div>
        <BackButton />
        <canvas id='logic-canvas' className='Canvas' width={0} height={0}
          onDragOver={this.handleDragOver.bind(this)} 
          onDrop={this.handleDrop.bind(this)}
          onContextMenu={this.handleContext.bind(this)}
          onAnimationEnd={() => getDrawController().fitStage()}
          onAnimationIteration={() => getDrawController().fitStage()}
        />
      </div>
    );
  }

}