const expect = require('chai').expect;
const sinon = require('sinon');
const testUtils = require('../utils');

const moduleFactory = require('../../../src/db/modules');
describe('Modules', () => {
  describe('#insert', () => {
    it('should call save on all submodules', () => {
      const fsObject = {
        save: sinon.spy()
      };

      const testGate = testUtils.makeModule('test-gate', 'gate');
      const subModule = testUtils.makeModule('sub-module', 'module', [testGate]);
      const mainModule = testUtils.makeModule('main-module', 'module', [subModule]);

      const Modules = moduleFactory(fsObject);
      Modules.insert(mainModule);

      const savedModuleIds = fsObject.save.getCalls()
        .map(call => call.args)
        .map(args => args[0])
        .map(m => m.id);

      expect(savedModuleIds).to.include('main-module');
      expect(savedModuleIds).to.include('sub-module');
      expect(savedModuleIds).to.not.include('test-gate');

    });
  });
});