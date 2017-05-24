var mongoose = require('mongoose');
var config = require('../src/config');

mongoose.connect(config.db, function(err) {
  if (err)
    throw err;
  mongoose.connection.db.dropDatabase(function(err, result) {
    console.log('Database *BOLO* has been dropped: ' + result);
    process.exit(0);
  });
  var mongoose = require('mongoose');
  var config = require('../src/config');

  mongoose.connect(config.db, function(err) {
    if (err)
      throw err;
    mongoose.connection.db.dropDatabase(function(err, result) {
      console.log('Database *BOLO* has been dropped: ' + result);
      process.exit(0);
    });
  });
});
