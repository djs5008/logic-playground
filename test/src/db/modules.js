const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');

const moduleFactory = require('../../../src/db/modules');
describe('Modules', () => {
  describe('#insert', () => {
    it('should call save on all submodules', () => {
      const fsObject = {
        save: sinon.spy()
      };

      const testGate = {
        id: 'test-gate',
        type: 'gate'
      };

      const subModule = {
        id: 'sub-module',
        type: 'module',
        components: [testGate]
      };

      const mainModule = {
        id: 'main-module',
        type: 'module',
        components: [subModule]
      };

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