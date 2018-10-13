// test utility functions

module.exports = {
  makeModule: function(id, type, components = []) {
    return {
      id, type, components
    }
  },
};