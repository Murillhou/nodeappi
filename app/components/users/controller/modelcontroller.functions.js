const _ = require('lodash');

const rs = (schemasPath, schemaName) => require((schemasPath.slice(-1) === '/' ? schemasPath : schemasPath + '/') + schemaName);

const createSchemaModelExtended = sp => sn => model => obj => {
  if(!(obj)) {
    return null;
  }
  const res = _.entries(model).length ? _.clone(model) : new(rs(sp, sn))();
  rs(sp, sn).schema.eachPath(path => {
    if(_.has(obj, path) && !_.has(res, path)) {
      res[path] = obj[path];
    }
  });
  return res;
};
const createSchemaDeleteOne = sp => sn => query =>
  new Promise((resolve, reject) =>
    rs(sp, sn).deleteOne(query, err => err ? reject(err) : resolve())
  );
const createSchemaFind = sp => sn => query =>
  new Promise((resolve, reject) =>
    query ?
    rs(sp, sn).find(query, (err, result) => err ? reject(err) : (result.length ? resolve(result) : resolve(null))) :
    reject('Empty arguments!')
  );
const createSchemaFindOne = sp => sn => query =>
  new Promise((resolve, reject) =>
    _.entries(query).length ?
    rs(sp, sn)
    .findOne(query, (err, model) =>
      err ? reject(err) : (model ? resolve(model) : resolve(null))) :
    reject('Empty query!')
  );
const createSchemaFindOneAndUpdate = sp => sn => query => obj =>
  new Promise((resolve, reject) =>
    rs(sp, sn)
    .findOneAndUpdate(query, obj, { upsert: true, new: true }, (err, item) => err ? reject(err) : resolve(item))
  );
const createSchemaFindOneAndDelete = sp => sn => query =>
  new Promise((resolve, reject) =>
    rs(sp, sn).findOneAndRemove(query, {}, (err, item) => err ? reject(err) : resolve(item))
  );
const createSchemaReplace = sp => sn => query => model =>
  new Promise((resolve, reject) =>
    (query && model && _.entries(query).length && _.entries(model).length) ?
    rs(sp, sn).replaceOne(query, model, (err, result) => err ? reject(err) : resolve(result)) :
    reject('Bad arguments!')
  );
const createSave = model =>
  new Promise((resolve, reject) => {
    if((model && _.entries(model).length)) {
      model.save((err, res) => {
        return err ? reject(err) : resolve(res);
      });
    } else {
      return reject('Bad argument!');
    }
  });
const createSchemaUpdate = sp => sn => query => model =>
  new Promise((resolve, reject) => {
    if(query && model && _.entries(query).length && _.entries(model).length) {
      rs(sp, sn).update(query, model, { multi: true }, (err, result) => {
        if(err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    } else {
      return reject('Bad arguments!');
    }
  });

module.exports = (sp, sn) => ({
  deleteOne: createSchemaDeleteOne(sp)(sn),
  extended: createSchemaModelExtended(sp)(sn),
  find: createSchemaFind(sp)(sn),
  findOne: createSchemaFindOne(sp)(sn),
  findOneAndUpdate: createSchemaFindOneAndUpdate(sp)(sn),
  findOneAndDelete: createSchemaFindOneAndDelete(sp)(sn),
  replace: createSchemaReplace(sp)(sn),
  save: createSave,
  update: createSchemaUpdate(sp)(sn)
});