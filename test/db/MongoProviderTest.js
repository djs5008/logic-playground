const sinon = require('sinon');
const mockery = require('mockery');
const expect = require('chai').expect;

describe('MongoProvider', function() {
    var dbConnection, mongoConnectMock;

    before(function() {
        mockery.enable();
        mongoConnectMock = sinon.stub();
        mockery.registerMock('mongodb', {
            MongoClient: {
                connect: mongoConnectMock,
            },
        });
        dbConnection = require('../../db/MongoProvider');
    });

    it('should return DB services on successful connection', function(done) {
        mongoConnectMock.returns(Promise.resolve({}));
        dbConnection('').then(dbServices => {
            try {
                let keys = ['get', 'remove', 'modify', 'userModels'];
                expect(dbServices).to.not.be.null;
                expect(dbServices).to.include.all.keys(keys.concat('conn'));
                keys.forEach(key => expect(dbServices[key]).to.be.a('function'));
                done();
            } catch(e) {
                done(e);
            }
        });
    });

    it('should return an error upon unsuccessful connection', function(done) {
        mongoConnectMock.returns(Promise.reject({}));
        dbConnection('').catch(error => {
            expect(error).to.be.an('error');
        })
        .catch(e => done(e));
    });

    describe('#get', function() {
        var dbMock;

        before(function() {
            dbMock = {

            };
        });

        it('should query the database with the correct id', function(done) {

        });
    });

    after(function() {
        mockery.disable();
    });
});