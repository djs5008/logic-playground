
// private functions

const assembleModuleWithRefs = function(fsObj, module) {
  const components = module.components;

  return Promise.all(components
    .filter(isSubModule)
    .map(m => fsObj.load(m.id)
      .then(m => assembleModuleWithRefs(fsObj, m)))
    .then(subModules => {
      const moduleMap = subModules
        .reduce((obj, m) => ({...obj, [m.id]: m}));

      const newComponents = components
        .map(component => isRefModule(component)
          ? moduleMap[component.id]
          : component);

      return {...module, components: newComponents};
    }));
};

const separateSubModules = function(module) {
  const components = module.components;
  const subModules = components.filter(isSubModule);

  const newComponents = components.map(component =>
    isSubModule(component)
      ? {type: "ref", id: component.id}
      : component);

  const allSubModules = subModules.map(separateSubModules)
    .reduce((x, y) => x.concat(y), []);
  return [{...module, components: newComponents}].concat(allSubModules);

};

const isRefModule = module => module.type.toLowerCase() === 'ref';
const isSubModule = module => module.type.toLowerCase() === 'module';

// public exports

module.exports = function(fsObject) {
  return {
    findById: function(id) {
      return fsObject.load(id)
        .then(module => assembleModuleWithRefs(fsObject, module));
    },

    insert: function(module) {
      separateSubModules(module).forEach(m => fsObject.save(m));
    },
  };
};
