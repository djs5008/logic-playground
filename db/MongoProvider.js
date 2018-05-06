const { MongoClient } = require('mongodb');
const { promisify } = require('util');

const makeDbServices = db => coll => ({
  query: function(queryParam) {
    return promisify(db.collection(this.coll)
      .find(queryParam).toArray);
  },
  remove: function(queryParam) {
    return db.collection(this.coll).deleteOne(queryParam);
  },
  add: function(id, newObject) {

  },
  db,
  coll,
});

const DBNAME = process.env.DBNAME || 'lpg';

module.exports = function(uri) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(uri)
      .then(conn => resolve(makeDbServices(conn.db(DBNAME))))
      .catch((e) => reject(e));
  });
};