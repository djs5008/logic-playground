const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const circuitRouter = require('../../routes/circuit');
const express = require('express');

chai.use(chaiHttp);

const buildDbServiceStub = function()  {
  return {
    query: this.stub(),
    remove: this.stub(),
    add: this.stub(),
  };
};

const assertIsResponse = res => {
  expect(res).to.be.json;
  expect(res.body).to.include.keys('status', 'body');
};

describe('circuit', () => {

  describe('#GET', () => {

    it('should return an error if module specified by id is not found', sinonTest(function(done) {
      const dbServicesStub = buildDbServiceStub.call(this);
      const app = express();

      dbServicesStub.query.returns(Promise.resolve([]));
      app.use('/circuit', circuitRouter(dbServicesStub));
      
      // fire test
      chai.request(app)
        .get('/circuit/5000')
        .then(function (res) {
          assertIsResponse(res);
          expect(res.body.status).to.eql('error');
          expect(res.body.body).to.eql('no results');
          done();
        }).catch(done);
    }));

    it('should return an error when no id is passed', sinonTest(function(done) {
      const dbServicesStub = buildDbServiceStub.call(this);
      const app = express();

      app.use('/circuit', circuitRouter(dbServicesStub));

      // fire test
      chai.request(app)
        .get('/circuit')
        .then(function (res) {
          assertIsResponse(res);
          expect(res.body.status).to.eql('error');
          expect(res.body.body).to.eql('invalid request');
          done();
        }).catch(done);
    }));

    it('should return a result when passed an id of a saved module', sinonTest(function(done) {
      const dbServicesStub = buildDbServiceStub.call(this);
      const app = express();
      const response = {test: 'test value'};

      app.use('/circuit', circuitRouter(dbServicesStub));

      dbServicesStub.query
        .withArgs({id: 5000})
        .returns(Promise.resolve([response]));

      // run the test!
      chai.request(app)
        .get('/circuit/5000')
        .then(function(res) {
          assertIsResponse(res);
          expect(res.body.status).to.eql('ok');
          expect(res.body.body).to.eql([response]);
          done();
        }).catch(done);
    }));


  });
});

