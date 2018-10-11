const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

module.exports = function(savePath) {

  // create module directory if does not exists
  mkdirp(savePath,
    () => console.log('module directory created'));
  
  return {
    fsProvider: {
      load: function (id) {
        const filePath = path.join(savePath, id);
        return readFile(path.resolve(filePath))
          .then(data => JSON.parse(data));
      },

      save: function (obj) {
        const id = obj.id;
        const filePath = path.join(savePath, id);
        return writeFile(path.resolve(filePath), JSON.stringify(obj));
      },
    }
  }
}