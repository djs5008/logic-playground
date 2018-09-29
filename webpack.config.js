const path = require('path')

module.exports = {
  entry: './public/js/lpg/core.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}