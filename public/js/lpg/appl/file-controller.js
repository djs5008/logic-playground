/* global $ */
define(function () {
  'use strict';

  /**
   * Construct FileController
   * 
   * @param {*} moduleController ModuleController instance
   */
  function FileController(moduleController) {
    this.moduleController = moduleController;
  }

  /**
   * Save the currently active module into your localStorage
   */
  FileController.prototype.saveActiveModule = function () {
    this.moduleController.activeModule.label = $('#module-name').val();
    console.log(JSON.stringify(this.moduleController.activeModule));
    localStorage.setItem('autosaveModule', JSON.stringify(this.moduleController.activeModule));
  };

  /**
   * Load a previously-saved modules from localStorage
   *  If a save is not found, load a new module
   */
  FileController.prototype.loadSavedModule = function () {
    if (localStorage.autosaveModule) {
      this.moduleController.activeModule = this.moduleController.loadModule(JSON.parse(localStorage.autosaveModule));
    } else {
      this.moduleController.newModule();
    }

    // Update Module Settings properties
    $('#module-name').val(this.moduleController.activeModule.label);
  };

  /**
   * Export (download) the active module into a *.lpm file
   */
  FileController.prototype.exportActiveModule = function () {
    const content = JSON.stringify(this.moduleController.activeModule);
    const filename = this.moduleController.activeModule.label + '.lpm';

    var file = new Blob([content], { type: 'application/octet-stream' });
    $('#export-module-dialog').attr('href', URL.createObjectURL(file));
    $('#export-module-dialog').attr('download', filename);
    $('#export-module-dialog').get(0).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  };

  /**
   * Load a module file for either importing or loading the active module
   * 
   * @param {boolean} isImport 
   */
  FileController.prototype.loadModuleFile = function (callback) {
    var me = this;

    // Spoof a click on the file input
    $('#load-module-dialog').get(0).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    // Reset file input on click (chrome)
    $('#load-module-dialog').click(function () {
      $('#load-module-dialog').get(0).value = null;
    });

    // On input change
    $('#load-module-dialog').on('change', function () {
      var files = document.getElementById('load-module-dialog').files;

      if (!files.length && files.length === 1) {
        alert('Please select an LPM file!');
        return;
      }

      // ensure file is compatible
      var file = files[0];

      // Check for valid file name
      if (!file.name.includes('.lpm')) {
        alert('Please select a valid .lpm file!');
        return;
      }

      // Setup filereader callback
      var reader = new FileReader();
      reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          callback(me, evt.target.result);
        }
      };

      // begin reading file blob
      var blob = file.slice(0, file.size);
      reader.readAsText(blob);

      return false;
    });
  };

  /**
   * Load a *.lpm file into the active module
   * 
   * @param {*} moduleData The JSON-data from the loaded module file
   */
  FileController.prototype.loadModule = function (me, moduleData) {
    // Update active module based on result of file
    me.moduleController.activeModule = me.moduleController.loadModule(JSON.parse(moduleData));

    // Update Module Settings properties
    $('#module-name').val(me.moduleController.activeModule.label);
  };

  /**
   * Import a module into session data to be used as embedded modules within the active module
   * 
   * @param {*} moduleData The JSON-data from the loaded module file
   */
  FileController.prototype.importModule = function (me, moduleData) {
    // setup array
    if (!sessionStorage.importedModules) {
      sessionStorage.setItem('importedModules', JSON.stringify([]));
    }

    // add imported module to session storage
    var arr = JSON.parse(sessionStorage.importedModules);
    arr.push(moduleData);
    sessionStorage.setItem('importedModules', JSON.stringify(arr));
  };

  return FileController;
});