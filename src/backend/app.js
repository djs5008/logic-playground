const express = require('express');
const fsProvider = require('./db/providers/localFsProvider');
const path = require('path');
const moduleRoutesFactory = require('./routes/module');

const appDependencies = [
  fsProvider(path.join('data', 'modules'))
];

module.exports = Promise.all(appDependencies)
  .then(dependencies => Object.assign({}, ...dependencies))
  .then(dependencies => {
    // extract dependencies
    const {
      fsProvider
    } = dependencies;

    const Module = require('./db/modules')(fsProvider);
    const app = express();

    // middleware
    app.use(express.json());
    app.use(express.static(path.resolve('public')));

    // homepage
    app.get('/', (req, res) => {
      res.sendFile(path.resolve('public/lpg.html'));
    });

    // routes
    app.use("/v0/modules", moduleRoutesFactory(Module));

    return app;
  });