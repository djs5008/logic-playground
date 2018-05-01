/* global createjs */
define(() => {
  'use strict';

  class ResourceController {

    constructor() {
      this.resourceQueue = new createjs.LoadQueue(false, 'img/lpg/', true);
    }

    /**
     * Load required resources
     */
    loadResources(callback) {
      console.info('loading resources...');
      this.resourceQueue.loadManifest([
        {'src': 'and-gate.png', 'id':'and-gate'},
        {'src': 'nand-gate.png', 'id':'nand-gate'},
        {'src': 'or-gate.png', 'id':'or-gate'},
        {'src': 'nor-gate.png', 'id':'nor-gate'},
        {'src': 'xor-gate.png', 'id':'xor-gate'},
        {'src': 'xnor-gate.png', 'id':'xnor-gate'},
        {'src': 'not-gate.png', 'id':'not-gate'}
      ], true);
      this.resourceQueue.on('complete', callback);
    }

    /**
     * Retrieve a loaded resource file by name
     * 
     * @param {string} name The name of the resource
     */
    getResource(name) {
      return this.resourceQueue.getResult(name);
    }

  }

  return ResourceController;
});