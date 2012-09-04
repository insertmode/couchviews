1.1.3 / 2012-08-11
==================

  * Now supports v0.6.18

1.1.2 / 2012-08-11
==================

  * .travis.yml will no longer be shipped with npm (added to .npmignore)

1.1.1 / 2012-08-11
==================

  * Fixed a bug in test/couchviews that required the test data to be explicitly ordered
  * Added support for travis-ci in .travis.yml and build status in README.md

1.1.0 / 2012-08-11
==================

  * couchviews.dump and couchviews.push now pass a list of affected design documents to cb
  * couchviews executable is a little bit more verbose and prints a list of affected design documents

1.0.4 / 2012-08-10
==================

  * Now using `npm test` instead of `make test`
  * test/ directory will be shipped with npm again

1.0.3 / 2012-08-09
==================

  * Added HISTORY.md with first entries
  * Updated README.md: added `err` parameters to callbacks

1.0.2 / 2012-08-09
==================

  * Added unit tests for executable in bin/couchviews
  * Added proper errer handling to bin/couchviews
  * Callbacks now return err as first param as well in lib/couchviews
  * test/ and Makefile are now added to .npmignore and therefore will no longer be published with npm

1.0.1 / 2012-08-09
==================

  * all callbacks now pass `err` as first parameter
  * added return statements to all `cb` calls

1.0.0 / 2012-08-08
==================

  * Initial release
