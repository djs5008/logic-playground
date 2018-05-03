const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const mockery = require('mockery');
const should = require('chai').should();
const assert = require('assert');
const { MongoClient } = require('mongodb');
describe('MongoProvider', () => {
  var mongoProvider;


  before(() => {
    mockery.enable();
    mockery.registerMock('mongodb', {MongoClient});
    mongoProvider = require('../../db/MongoProvider');
  });

  it('should return a db services object upon successful connection', sinonTest(function(done) {
    let MongoClientMock = this.mock(MongoClient);
    MongoClientMock.expects('connect')
      .once()
      .returns(Promise.resolve({db: () => {}}));
        
    mongoProvider('mongodb://localhost:27017/').then(dbServices => {
      let keys = ['query', 'modify', 'remove'];
      dbServices.should.be.a('function');
      dbServices('testCollection').should.have.all.keys([...keys, 'db', 'coll']);
      keys.forEach(key => dbServices('testCollection')[key].should.be.a('function'));
      done();
    }).catch(e => done(e));

  }));

  it('should try to connect to db specified by uri', sinonTest(function(done) {
    const TEST_URI = 'mongodb://localhost:27017/';
    let MongoClientMock = this.mock(MongoClient);
    MongoClientMock.expects('connect')
      .once()
      .withArgs(TEST_URI)
      .returns(Promise.resolve({db: function() {}}));
        
    mongoProvider(TEST_URI).then(() => {
      MongoClientMock.verify();
      done();
    }).catch(e => done(e));
  }));

  it('should return an error upon unsuccessful connection', sinonTest(function(done) {
    let MongoClientMock = this.mock(MongoClient);
    MongoClientMock.expects('connect')
      .once()
      .returns(Promise.reject(Error('test error')));
        
    mongoProvider('')
      .then(() => done(Error('this should not be successful.')))
      .catch(e => done());
  }));

  context('with a successful connection to the database', () => {
    let buildDbSpy;
    before(() => {
      buildDbSpy = (...spies) => ({
        db: () => ({
          collection: () => ({
            find: spies[0],
            deleteOne: spies[1],
          }),
        })
      });
    });

    describe('#query', () => {
      it('should query database with specified query parameter', sinonTest(function(done) {
        const MongoClientMock = this.mock(MongoClient);
        const findSpy = this.spy(() => ({toArray: this.stub()}));
        const deleteSpy = this.spy();
        const dbSpy = buildDbSpy(findSpy, deleteSpy);
        const queryParam = {test: 'name'};

        MongoClientMock.expects('connect')
          .once()
          .returns(Promise.resolve(dbSpy));
                
        mongoProvider('')
          .then(dbServices => {
            let coll = dbServices('testCollection');
            return coll.query(queryParam);
          })
          .then(() => {
            assert(findSpy.calledOnce);
            done();
          })
          .catch(done);
      }));
    });

    describe('#remove', () => {
      it('should delete documents based on query parameter', sinonTest(function(done) {
        const MongoClientMock = this.mock(MongoClient);
        const findSpy = this.spy(() => ({toArray: this.stub()}));
        const deleteSpy = this.spy();
        const dbSpy = buildDbSpy(findSpy, deleteSpy);
        const queryParam = {test: 'name'};

        MongoClientMock.expects('connect')
          .once()
          .returns(Promise.resolve(dbSpy));
                
        mongoProvider('')
          .then(dbServices => {
            let coll = dbServices('testCollection');
            return coll.remove(queryParam);
          })
          .then(() => {
            assert(deleteSpy.calledOnce);
            done();
          })
          .catch(done);
      }));
    });
  });

  after(() => mockery.disable());
});