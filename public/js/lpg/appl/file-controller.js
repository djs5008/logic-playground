/* global $ */
define(() => {
  'use strict';

  class FileController {

    /**
     * Construct FileController
     * 
     * @param {*} moduleController ModuleController instance
     */
    constructor(moduleController) {
      this.moduleController = moduleController;
    }

    /**
     * Save the currently active module into your localStorage
     */
    saveActiveModule() {
      this.moduleController.activeModule.label = $('#module-name').val();
      console.log(JSON.stringify(this.moduleController.activeModule));
      localStorage.setItem('autosaveModule', JSON.stringify(this.moduleController.activeModule));
    }

    /**
     * Load a previously-saved modules from localStorage
     *  If a save is not found, load a new module
     */
    loadSavedModule() {
      if (localStorage.autosaveModule) {
        console.info('loading saved module...');
        this.moduleController.activeModule = this.moduleController.loadModule(JSON.parse(localStorage.autosaveModule));
      } else {
        this.moduleController.newModule();
      }

      // Update Module Settings properties
      $('#module-name').val(this.moduleController.activeModule.label);
    }

    /**
     * Export (download) the active module into a *.lpm file
     */
    exportActiveModule() {
      const content = JSON.stringify(this.moduleController.activeModule);
      const filename = this.moduleController.activeModule.label + '.lpm';

      var file = new Blob([content], { type: 'application/octet-stream' });
      $('#export-module-dialog').attr('href', URL.createObjectURL(file));
      $('#export-module-dialog').attr('download', filename);
      $('#export-module-dialog').get(0).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }

    /**
     * Load a module file for either importing or loading the active module
     * 
     * @param {boolean} isImport 
     */
    loadModuleFile(callback) {
      var me = this;

      // Spoof a click on the file input
      $('#load-module-dialog').get(0).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      // Reset file input on click (chrome)
      $('#load-module-dialog').click(() =>  {
        $('#load-module-dialog').get(0).value = null;
      });

      // On input change
      $('#load-module-dialog').on('change', () =>  {
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
        reader.onloadend = (evt) =>  {
          if (evt.target.readyState == FileReader.DONE) {
            callback(me, evt.target.result);
          }
        };

        // begin reading file blob
        var blob = file.slice(0, file.size);
        reader.readAsText(blob);

        return false;
      });
    }

    /**
     * Load a *.lpm file into the active module
     * 
     * @param {*} moduleData The JSON-data from the loaded module file
     */
    loadModule(me, moduleData) {
      console.info('loading module...');
      setTimeout(() => {
        // Update active module based on result of file
        me.moduleController.activeModule = me.moduleController.loadModule(JSON.parse(moduleData));

        // Update Module Settings properties
        $('#module-name').val(me.moduleController.activeModule.label);
      }, 0);
    }

    /**
     * Import a module into session data to be used as embedded modules within the active module
     * 
     * @param {*} moduleData The JSON-data from the loaded module file
     */
    importModule(me, moduleData) {
      console.info('importing module...');
      setTimeout(() => {
        // setup array
        if (!sessionStorage.importedModules) {
          sessionStorage.setItem('importedModules', JSON.stringify([]));
        }

        // add imported module to session storage
        var arr = JSON.parse(sessionStorage.importedModules);
        arr.push(moduleData);
        sessionStorage.setItem('importedModules', JSON.stringify(arr));
      }, 0);
    }
  }

  return FileController;
});