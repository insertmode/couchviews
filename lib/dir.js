var fs = require('fs'),
    path = require('path');

/**
 * Create a new directory object with `path`.
 *
 * @param {String} path
 * @return {Object} new object
 */

var Dir = module.exports = function (path) {
  this.path = path;
};

/**
 * Convenience constructor for Dir.
 *
 * @param {String} path
 * @return {Object} new object
 */

Dir.create = function (path) {
  return new Dir(path);
};

/**
 * Load all design documents and callback `cb()`.
 *
 * @param {Function} cb
 */

Dir.prototype.loadDesignDocs = function (cb) {
  var that = this;

  fs.readdir(this.path, function (err, files) {
    if (err) { throw new Error('error when reading dir: ' + err); }
    if (files.length === 0) { cb([]); }

    var designDocs = [],
        current = 0,
        step = function () {
          current = current + 1;
          if (current >= files.length) { cb(designDocs); }
        };

    files.forEach(function (file) {
      that.loadDesignDoc(path.join(that.path, file), function (designDoc) {
        designDocs.push(designDoc);
        step();
      });
    });

  });
};

/**
 * Load `designDoc` and callback `cb(data)`.
 *
 * @param {String} file
 * @param {Function} cb
 */

Dir.prototype.loadDesignDoc = function (file, cb) {
  fs.readFile(file, function (err, data) {
    if (err) { throw new Error('error when loading design doc: ' + err); }
    cb(JSON.parse(data));
  });
};

/**
 * Save design documents `designDocs` and callback `cb`.
 *
 * @param {Array} designDocs
 * @param {Function} cb
 */

Dir.prototype.saveDesignDocs = function (designDocs, cb) {
  if (designDocs.length === 0) { cb(); }

  var that = this,
      saved = 0,
      step = function () {
        saved = saved + 1;
        if (saved >= designDocs.length) { cb(); }
      };

  designDocs.forEach(function (designDoc) {
    that.saveDesignDoc(designDoc, step);
  });
};

/**
 * Save `designDoc` and callback `cb`.
 *
 * @param {Object} designDoc
 * @param {Function} cb
 */

Dir.prototype.saveDesignDoc = function (designDoc, cb) {
  // remove revision
  delete designDoc._rev;

  var file = this.file(designDoc),
      data = JSON.stringify(designDoc);

  fs.writeFile(file, data, function (err) {
    if (err) { throw new Error('error when saving design doc: ' + err); }
    cb();
  });
};

/**
 * Creates the correct file name for a `designDoc`.
 *
 * @param {Object} designDoc
 * @return {String} file
 */

Dir.prototype.file = function (designDoc) {
  var id = designDoc._id.replace('/', '-');
  return path.join(this.path, id + '.json');
};
