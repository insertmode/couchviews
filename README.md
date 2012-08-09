# couchviews

Store and load CouchDB views to / from your file system for easier setup of new databases.

    $ couchviews dump http://username:password@127.0.0.1:5984/database ./database/

When it comes to unit testing your CouchDB application, you often need to setup a clean database for each test case. The only thing you need to do after setup is importing all views – use **couchviews** to do this.



## Installation

    $ npm install -g couchviews 



## Usage

Use `dump` to store your views into a directory and `push` to load them into your database again.

    $ couchviews dump <couchdb> <dir>
    $ couchviews push <couchdb> <dir> 

Example:

    $ couchviews dump http://username:password@127.0.0.1:5984/database ./database/
    $ couchviews push http://username:password@127.0.0.1:5984/database ./database/


You can also use couchviews as a module in your own node projects. 

    var couchviews = require('couchviews');
    
    var url = 'http://localhost:5984/db', path = 'db';
    
    couchviews.dump(url, path, function (err) {
      console.log('done');
    });
    
    couchviews.push(url, path, function (err) {
      console.log('done');
    });
    


## Developers

Feel free to experiment and improve this code. There are some unit tests written with mocha and should. Just type `make test` to run them. You'll need a local CouchDB instance to run tests.
