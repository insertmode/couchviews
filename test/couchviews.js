var couchviews = require('../lib/couchviews'),
    fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    request = require('request'),
    couchclient = require('couch-client');

var url = 'http://localhost:5984/couchviews_test',
    dir = 'testdata',
    db = couchclient(url),
    data = [
      {
        _id: '_design/first',
        language: 'javascript',
        views: {}
      },
      {
        _id: '_design/second',
        language: 'javascript',
        views: {}
      }
    ];

var setupDb = function (cb) {
  request.put(url, function (err, res, body) {
    if (err) { throw new Error('could not create db: ' + err); }
    cb();
  });
};

var teardownDb = function (cb) {
  request.del(url, function (err, res, body) {
    if (err) {throw new Error('could not delete db: ' + err); }
    cb();
  });
};

var insertDbData = function (cb) {
  request.post(url, { json: data[0] }, function (err, res, body) {
    if (err) { throw new Error('could not create test data: ' + err); }
    if (res.statusCode >= 300) { throw new Error('could not create test data: ' + body); }
    request.post(url, { json:data[1] }, function (err, res, body) {
      if (err) { throw new Error('could not create test data: ' + err); }
      if (res.statusCode >= 300) { throw new Error('could not create test data: ' + body); }
      cb();
    });
  });
};

var setupDir = function (cb) {
  fs.mkdir(dir, cb);
};

var teardownDir = function (cb) {
  // sync version
  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    fs.unlinkSync(path.join(dir, file));
  });
  fs.rmdirSync(dir);
  cb();
};

var insertDirData = function (cb) {
  var fileName1 = path.join(dir, data[0]._id.replace('/', '-') + '.json'),
      fileContent1 = JSON.stringify(data[0]),
      fileName2 = path.join(dir, data[1]._id.replace('/', '-') + '.json'),
      fileContent2 = JSON.stringify(data[1]);
  fs.writeFileSync(fileName1, fileContent1);
  fs.writeFileSync(fileName2, fileContent2);
  cb();
};

describe('couchviews', function () {

  describe('#dump()', function () {

    beforeEach(function (done) {
      setupDb(function () {
        setupDir(done);
      });
    });

    afterEach(function (done) {
      teardownDb(function () {
        teardownDir(done);
      });
    });

    it('can be invoked with empty database', function (done) {
      couchviews.dump(url, dir, done);
    });

    it('generates the necessarry files', function (done) {
      insertDbData(function () {
        couchviews.dump(url, dir, function () {
          var files = fs.readdirSync(dir);
          files.should.include('_design-first.json');
          files.should.include('_design-second.json');
          files.should.have.length(2);
          done();
        });
      });
    });

    it('saves a file with the correct content', function (done) {
      insertDbData(function () {
        couchviews.dump(url, dir, function () {
          var content = fs.readFileSync(path.join(dir, '_design-first.json')),
              obj = JSON.parse(content);
          obj._id.should.equal(data[0]._id);
          obj.language.should.equal(data[0].language);
          obj.views.should.eql(data[0].views);
          done();
        });
      });
    });

    it('removes the _rev field from data', function (done) {
      insertDbData(function () {
        couchviews.dump(url, dir, function () {
          var content = fs.readFileSync(path.join(dir, '_design-first.json')),
              obj = JSON.parse(content);
          obj.should.not.have.property('_rev');
          done();
        });
      });
    });

  });

  describe('#push()', function () {

    beforeEach(function (done) {
      setupDb(function () {
        setupDir(done);
      });
    });

    afterEach(function (done) {
      teardownDb(function () {
        teardownDir(done);
      });
    });

    it('can be invoked with empty folder', function (done) {
      couchviews.push(url, dir, done);
    });

    it('generates the necessary documents', function (done) {
      insertDirData(function () {
        couchviews.push(url, dir, function () {
          db.get(data[0]._id, function (err, designDoc) {
            if (err) { throw new Error('error when getting design document: ' + err); }
            db.get(data[1]._id, function (err, designDoc) {
              if (err) { throw new Error('error when getting design document: ' + err); }
              done();
            });
          });
        });
      });
    });

    it('saves a file with the correct content', function (done) {
      insertDirData(function () {
        couchviews.push(url, dir, function () {
          db.get(data[0]._id, function (err, designDoc) {
            if (err) { throw new Error('error when getting design document: ' + err); }
            delete designDoc._rev;
            designDoc.should.eql(data[0]);
            done();
          });
        });
      });
    });

  });
});

describe('bin/couchviews', function () {

    beforeEach(function (done) {
      setupDb(function () {
        setupDir(done);
      });
    });

    afterEach(function (done) {
      teardownDb(function () {
        teardownDir(done);
      });
    });

    it('dump can be invoked', function (done) {
      var cmd = 'bin/couchviews dump ' + url + ' ' + dir;
      exec (cmd, function (err, stdout, stderr) {
        if (err) { throw new Error(); }
        done();
      });
    });

    it('push can be invoked', function (done) {
      var cmd = 'bin/couchviews push ' + url + ' ' + dir;
      exec (cmd, function (err, stdout, stderr) {
        if (err) { throw new Error(); }
        done();
      });
    });

});
