const mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://admin:wowdb123@139.59.58.64:27017/wow?authSource=admin');

db.on('error', console.error);

db.once('open', function () {

    console.log("db connect");

    db.dropCollection("users", function (err, result) {
        if (err) {
            console.log("error delete collection - users");
        } else {
            console.log("success - users");
        }
    });

    db.dropCollection("customers", function (err, result) {
      if (err) {
          console.log("error delete collection - customers");
      } else {
          console.log("success - customers");
      }
    });

    db.dropCollection("workorders", function (err, result) {
      if (err) {
          console.log("error delete collection - workorders");
      } else {
          console.log("success - workorders");
      }
    });

    db.dropCollection("materials", function (err, result) {
      if (err) {
          console.log("error delete collection - materials");
      } else {
          console.log("success - materials");
      }
    });

 

});
