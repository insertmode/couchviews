var couchclient = require('couch-client');

/**
 * Create a new couchdb database object with `url`.
 *
 * @param {String} url
 * @return {Object} new object
 */

var Db = module.exports = function (url) {
  this.url = url;
};

/**
 * Convenience constructor for Db.
 *
 * @param {String} url
 * @return {Object} new object
 */

Db.create = function (url) {
  return new Db(url);
};

/**
 * Load all design documents and callback `cb(err, designDocs)`.
 *
 * @param {Function} cb
 */

Db.prototype.loadDesignDocs = function (cb) {
  var that = this,
      db = couchclient(this.url),
      query = '/_all_docs?limit=11&startkey=%22_design%22&endkey=%22_design0%22';
  
  db.request('GET', this.url + query, null, function (err, result) {
    if (err) { return cb(err); }
    if (result.rows.length === 0) { return cb(null, []); }

    var designDocs = [], 
        current = 0,
        step = function () {
          current = current + 1;
          if (current >= result.rows.length) { return cb(null, designDocs); }
        };
    
    result.rows.forEach(function (row) {
      that.loadDesignDoc(row.id, function (err, designDoc) {
        designDocs.push(designDoc);
        step();
      });
    });

  });

};

/**
 * Load design document with `id` and callback `cb(err, designDoc)`.
 *
 * @param {String} id
 * @param {Function} cb
 */

Db.prototype.loadDesignDoc = function (id, cb) {
  var db = couchclient(this.url);
  db.get(id, function (err, designDoc) {
    if (err) { return cb(err); }
    return cb(null, designDoc);
  });
};

/**
 * Save design documents `designDocs` and callback `cb(err)`.
 *
 * @param {Array} designDocs
 * @param {Function} cb
 */

Db.prototype.saveDesignDocs = function (designDocs, cb) {
  if (designDocs.length === 0) { return cb(null); }

  var that = this,
  saved = 0,
  step = function () {
    saved = saved + 1;
    if (saved >= designDocs.length) { return cb(null); }
  };

  designDocs.forEach(function (designDoc) {
    that.saveDesignDoc(designDoc, step);
  });
};

/**
 * Save `designDoc` and callback `cb(err)`.
 *
 * @param {Object} designDoc
 * @param {Function} cb
 */

Db.prototype.saveDesignDoc = function (designDoc, cb) {
  var db = couchclient(this.url);
  db.save(designDoc, function (err) {
    if (err) { return cb(err); }
    return cb(null);
  });
};
