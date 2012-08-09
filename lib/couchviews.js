var Db = require('./db'), 
    Dir = require('./dir');

var couchviews = module.exports = {

  /**
   * Dump all views of a couchdb at `url` to `path` and callback `cb(err)`.
   *
   * @param {String} url to couchdb
   * @param {String} path to store views
   * @param {Function} cb
   */

  dump: function (url, path, cb) {
    var db = Db.create(url),
        dir = Dir.create(path); 

    db.loadDesignDocs(function (err, designDocs) {
      if (err) { return cb(err); }
      dir.saveDesignDocs(designDocs, function (err) {
        if (err) { return cb(err); }
        return cb(null);
      });
    });
  },

  /**
   * Push all views from `path` to couchdb at `url` and callback `cb(err)`.
   *
   * @param {String} url to couchdb
   * @param {String} path to load views from
   * @param {Function} cb
   */

  push: function (url, path, cb) {
    var db = Db.create(url),
        dir = Dir.create(path);

    dir.loadDesignDocs(function (err, designDocs) {
      if (err) { return cb(err); }
      db.saveDesignDocs(designDocs, function (err) {
        if (err) { return cb(err); }
        return cb(null);
      });
    });
  }

};
