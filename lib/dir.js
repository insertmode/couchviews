var fs = require('fs'),
    path = require('path');

/**
 * Create a new directory object with `path` and file format.
 *
 * @param {String} path
 * @param {Object} format - must implement stringify() and parse(), defauls to JSON
 * @return {Object} new object
 */

var Dir = module.exports = function (path, format) {
  this.path = path;
  this.format = format || JSON;
};

/**
 * Convenience constructor for Dir.
 *
 * @param {String} path
 * @return {Object} new object
 */

Dir.create = function (path, format) {
  return new Dir(path, format);
};

/**
 * Load all design documents and callback `cb(err, designDocs)`.
 *
 * @param {Function} cb
 */

Dir.prototype.loadDesignDocs = function (cb) {
  var that = this;

  fs.readdir(this.path, function (err, files) {
    if (err) { return cb(err); }
    if (files.length === 0) { return cb(null, []); }

    var designDocs = [],
        current = 0,
        step = function () {
          current = current + 1;
          if (current >= files.length) { return cb(null, designDocs); }
        };

    files.forEach(function (file) {
      that.loadDesignDoc(path.join(that.path, file), function (err, designDoc) {
        designDocs.push(designDoc);
        step();
      });
    });

  });
};

/**
 * Load `designDoc` and callback `cb(err, data)`.
 *
 * @param {String} file
 * @param {Function} cb
 */

Dir.prototype.loadDesignDoc = function (file, cb) {
  var that = this;
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) { return cb(err); } 
    return cb(null, that.format.parse(data));
  });
};

/**
 * Save design documents `designDocs` and callback `cb(err)`.
 *
 * @param {Array} designDocs
 * @param {Function} cb
 */

Dir.prototype.saveDesignDocs = function (designDocs, cb) {
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

Dir.prototype.saveDesignDoc = function (designDoc, cb) {
  // remove revision
  delete designDoc._rev;

  var file = this.file(designDoc),
      data = this.format.stringify(designDoc);

  fs.writeFile(file, data, function (err) {
    if (err) { return cb(err); }
    return cb();
  });
};

/**
 * Creates the correct file name for a `designDoc`.
 *
 * @param {Object} designDoc
 * @return {String} file
 */

Dir.prototype.file = function (designDoc) {
  if (typeof(this.format.getFileName) !== 'undefined') {
    var filename = this.format.getFileName(designDoc);
    return path.join(this.path, filename);
  } else {
    var id = designDoc._id.replace('/', '-');
    return path.join(this.path, id + '.json');
  }
};
