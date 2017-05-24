/**
 * This class sets the controls for the account routes
 */

var User = require("../models/user.js");
var Agency = require("../models/agency.js");
var Bolo = require("../models/bolo.js");

/**
 * Responds with a the account home page.
 */
exports.getAccountDetails = function(req, res, next) {
  User.findUserByID(req.user._id, function(err, user) {
    if (err)
      next(err);
    else {
      res.render('account', {user: user});
    }
  })
};

exports.getUserNotifications = function(req, res, next) {
  var listOfAgencies = req.user.agencySubscriber;
  Agency.findAgenciesByID(listOfAgencies, function(err, agencies) {
    if (err)
      next(err);
    else {
      res.render('account-notifications', {agencies: agencies});
    }
  })
};

exports.getAvailableAgencyNotifications = function(req, res, next) {
  var listOfAgencies = req.user.agencySubscriber;
  Agency.findUnsubscribedAgenciesByID(listOfAgencies, function(err, agencies) {
    if (err)
      next(err);
    else {
      res.render('account-notifications-add', {agencies: agencies});
    }
  })
};

/**
 * Process form data to unsubscribe the user to the requested agency
 * notifications
 */
exports.postUnsubscribeNotifications = function(req, res, next) {
  if (typeof req.body.agencies === 'undefined')
    res.redirect('/account/notifications');
  else {
    User.unsubscribeFromAgencies(req.user._id, req.body.agencies, function(err, user) {
      if (err)
        next(err)
      else {
        //for each agency find bolos
        var allBolos = [];
        var i = 0;
        req.body.agencies.forEach(function(entry) {
          Bolo.findAllBolosByAgencyID(req, entry, function(err, buf) {
            console.log(i);
            if (err)
              next(err);
            else {
              allBolos = allBolos.concat(buf);
            }
            if (i == req.body.agencies.length - 1) {
              //subscribe to each bolo
              allBolos.forEach(function(bolo) {
                console.log(bolo + "\n\n\n");
                Bolo.unsubscribeFromBOLO(bolo._id, req.user.email, function(err, temp) {
                  if (err) {
                    console.log("Error subscribing bolo...\n" + err);
                  } else {
                    console.log(bolo._id);
                  }
                });
              });
              res.redirect('/account/notifications');
            }
            i++;
          });
        });
      }
    });
  }
};

/**
 * Process form data to subscribe the user to the requested agency
 * notifications
 */
exports.postSubscribeNotifications = function(req, res, next) {
  console.log(req.user._id);
  console.log(req.body.agencies);
  if (typeof req.body.agencies === 'undefined')
    res.redirect('/account/notifications/subscribe');
  else {
    Agency.findAgenciesByID(req.body.agencies, function(err, agencies) {
      if (err)
        next(err);
      else {
        User.subscribeToAgencies(req.user._id, agencies, function(err, user) {
          if (err)
            next(err)
          else {
            //for each agency find bolos
            var allBolos = [];
            var i = 0;
            req.body.agencies.forEach(function(entry) {
              Bolo.findAllBolosByAgencyID(req, entry, function(err, buf) {
                console.log(i);

                if (err)
                  next(err);
                else {
                  allBolos = allBolos.concat(buf);
                }
                if (i == req.body.agencies.length - 1) {
                  //subscribe to each bolo
                  allBolos.forEach(function(bolo) {
                    console.log(bolo + "\n\n\n");
                    Bolo.subscribeToBOLO(bolo._id, req.user.email, function(err, temp) {
                      if (err) {
                        console.log("Error subscribing bolo...\n" + err);
                      } else {
                        console.log(bolo._id);
                      }
                    });
                  });
                  res.redirect('/account/notifications/subscribe');
                }
                i++;
              });
            });

          }
        });
      }
    });
  }

};
