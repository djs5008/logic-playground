const mockery = require('mockery');
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const RouteConstants = require('../../routes/RouteConstants');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('mountRoutes', () => {

  before(() => {
    mockery.enable();
  });

  it('should mount all routes specified in RouteConstants', sinonTest(function() {
    const useSpy = this.spy();
    const RouterStub = this.stub().returns({use: useSpy});

    mockery.registerMock('express', {Router: RouterStub});
    mockery.registerMock('./circuit', function() {});
    const mountRoutes = require('../../routes');
        
    mountRoutes({});

    for(let route in RouteConstants)
      useSpy.should.have.been.calledWith(RouteConstants[route]);
  }));

  after(() => mockery.disable());
});