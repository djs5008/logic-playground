const express = require('express');
const utils = require('./utils');

module.exports = function(Module) {
  const router = express.Router();

  // routes
  router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    Module.findById(id)
      .then(module => res.send(utils.response('success', module)))
      .catch(next);
  }),

  router.post("/", (req, res) => {
    const module = req.body;
    Module.insert(module);
    res.send(utils.response('success', 'you did it'));
  });

  // error middleware

  // 404
  router.use(function(err, req, res, next) {
    if (err.code === 'ENOENT') {
      res.status(404)
        .send(utils.response('error', 'could not find module'));
    } else {
      next(err);
    }
  });

  // other shit
  router.use(function(err, req, res, next) {
    res.status(500)
      .send(utils.response('error', 'internal server error'));
  });

  return router;
};