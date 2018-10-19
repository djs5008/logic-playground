export class FileController {

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
    console.log(JSON.stringify(this.moduleController.getActiveModule()));
    localStorage.setItem('autosaveModule', JSON.stringify(this.moduleController.getActiveModule()));
  }

  /**
   * Load a previously-saved modules from localStorage
   *  If a save is not found, load a new module
   */
  loadSavedModule() {
    if (localStorage.autosaveModule) {
      console.info('loading saved module...');
      let savedModule = JSON.parse(localStorage.autosaveModule);
      this.moduleController.setActiveModule(this.moduleController.loadModule(savedModule));
      console.info('saved module loaded!');
    } else {
      this.moduleController.newModule();
    }
  }

  /**
   * Export (download) the active module into a *.lpm file
   */
  exportActiveModule() {
    const content = JSON.stringify(this.moduleController.getActiveModule());
    const filename = this.moduleController.getActiveModule().label + '.lpm';

    let file = new Blob([content], { type: 'application/octet-stream' });
    let exportModuleDialog = document.getElementById('export-module-dialog');

    exportModuleDialog.setAttribute('href', URL.createObjectURL(file));
    exportModuleDialog.setAttribute('download', filename);
    exportModuleDialog.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }

  /**
   * Load a module file for either importing or loading the active module
   * 
   * @param {boolean} isImport 
   */
  loadModuleFile(callback) {
    let me = this;
    let loadModuleDialog = document.getElementById('load-module-dialog');

    console.log('loading file');

    // Spoof a click on the file input
    loadModuleDialog.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

    const resetInput = () => {
      loadModuleDialog.value = '';
    };

    // On input change
    loadModuleDialog.addEventListener('change', (evt) => {
      let files = document.getElementById('load-module-dialog').files;

      if (!files.length && files.length === 1) {
        alert('Please select an LPM file!');
        resetInput();
        return;
      }

      // ensure file is compatible
      let file = files[0];

      if (file) {
        // Check for valid file name
        if (!file.name.includes('.lpm')) {
          alert('Please select a valid .lpm file!');
          resetInput();
          return;
        }

        // Setup filereader callback
        let reader = new FileReader();
        reader.onloadend = (evt) => {
          if (evt.target.readyState === FileReader.DONE) {
            callback(me, evt.target.result);
          }
        };

        // begin reading file blob
        let blob = file.slice(0, file.size);
        reader.readAsText(blob);
      }

      resetInput();
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
    // Update active module based on result of file
    me.moduleController.setActiveModule(me.moduleController.loadModule(JSON.parse(moduleData)));
  }

  /**
   * Import a module into session data to be used as embedded modules within the active module
   * 
   * @param {*} moduleData The JSON-data from the loaded module file
   */
  importModule(me, moduleData) {
    console.info('importing module...');
    // setup array
    if (!sessionStorage.importedModules) {
      sessionStorage.setItem('importedModules', JSON.stringify([]));
    }

    // add imported module to session storage
    var arr = JSON.parse(sessionStorage.importedModules);
    arr.push(moduleData);
    sessionStorage.setItem('importedModules', JSON.stringify(arr));
  }
}