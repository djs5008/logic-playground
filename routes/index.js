const { Router } = require('express');
const RouteConstants = require('./RouteConstants');

// routes
const circuitRouter = require('./circuit');

function mountRoutes(dbServices) {
  const router = Router();
  router.use(RouteConstants.CircuitURL, circuitRouter(dbServices));
  return router;
}

module.exports = mountRoutes;