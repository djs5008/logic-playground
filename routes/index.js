const { Router } = require('express');
const RouteConstants = require('./RouteConstants');

function mountRoutes(dbServices) {
  const router = Router();
  router.use(RouteConstants.CircuitURL);
  return router;
}

module.exports = mountRoutes;