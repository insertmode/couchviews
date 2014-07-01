var Db = require('./db'), 
    Dir = require('./dir');

var mapIds = function (designDocs) {
  return designDocs.map(function (current) {
    return current._id;
  });
};
var couchviews = module.exports = {

  /**
   * Dump all views of a couchdb at `url` to `path` and callback `cb(err, designDocs)`.
   * @param {String} url to couchdb
   * @param {String} path to store views
   * @param {Object} format - must implement stringify() and parse(), defauls to JSON
   * @param {Function} cb
   */

  dump: function (url, path, format, cb) {
    if (arguments.length === 3) {
      cb = format;
      format = JSON; 
    }     
    var db = Db.create(url),
        dir = Dir.create(path, format); 

    db.loadDesignDocs(function (err, designDocs) {
      if (err) { return cb(err); }
      dir.saveDesignDocs(designDocs, function (err) {
        if (err) { return cb(err); }
        return cb(null, mapIds(designDocs));
      });
    });
  },

  /**
   * Push all views from `path` to couchdb at `url` and callback `cb(err, designDocs)`.
   *
   * @param {String} url to couchdb
   * @param {String} path to load views from
   * @param {Object} format - must implement stringify() and parse(), defauls to JSON
   * @param {Function} cb
   */

  push: function (url, path, format, cb) {
    if (arguments.length === 3) {
      cb = format;
      format = JSON; 
    }     
    var db = Db.create(url),
        dir = Dir.create(path, format);

    dir.loadDesignDocs(function (err, designDocs) {
      if (err) { return cb(err); }
      db.saveDesignDocs(designDocs, function (err) {
        if (err) { return cb(err); }
        return cb(null, mapIds(designDocs));
      });
    });
  }

};
