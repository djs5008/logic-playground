const { Router } = require('express');

function circuitRouteHandler(dbServices) {
  const router = Router();

  const response = status => body => ({
    status, body,
  });

  const errorResponse = response('error');
  const validResponse = response('ok');

  router.get('/', (req, res) => res.json(errorResponse('invalid request')));

  router.get('/:id', (req, res) => {
    const queryParam = {id: parseInt(req.params.id)};

    dbServices.query(queryParam)
      .then(data => {
        if (data.length === 0) res.json(errorResponse('no results'));
        else res.json(validResponse(data.slice(0, 1)));
      })
      .catch(err => res.json(errorResponse(err)));
  });

  router.post('/', (req, res) => {
    res.send('not implemented');
  });

  router.delete('/', (req, res) => {
    res.send('not implemented');
  });

  return router;
}

module.exports = circuitRouteHandler;