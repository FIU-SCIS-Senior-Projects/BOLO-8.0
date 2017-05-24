'use strict';

var fs = require('fs');
var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Agency = require('../models/agency');
var password = require('../controllers/resetPassword');
var config = require('../config');
var md = require('node-markdown').Markdown;

var emailService = require('../services/email-service');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findUserByID(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Lets the user know that their password will expire soon after signing in
 * Todo: Implement next iteration
 *
 * @param user The users information
 * @param timeLeft Amount of time left till expiration
 */
function sendExpirationReminder(user, timeLeft) {
  var daysLeft;
  //
  if (timeLeft / 86400000 < 1) {
    daysLeft = "1 day";
  } else {
    daysLeft = Math.floor(timeLeft / 86400000).toString() + ' days';
  }
  emailService.send({
    'to': user.email,
    'from': config.email.from,
    'fromName': config.email.fromName,
    'subject': 'BOLO Alert: Password Expiration',
    'text': 'Your password will expire in less than ' + daysLeft + '\n' + 'To change your password, please login, go to Account, then click \'Change Password\'\n'
  })
}

/**
 * Render login page if not logged in
 */
exports.getLogIn = function(req, res) {
  if (req.isAuthenticated()) {
    req.flash('error_msg', 'Already logged in as *' + req.user.username + '*');
    res.redirect('/bolo');
  } else {
    fs.readFile(__dirname + '/../public/Login.md', function(err, data) {
      if (err) {
        console.log('Login.md could not be read...\n' + err.stack);
        res.render('login', {
          md: md,
          text: 'Welcome'
        });
      } else {
        console.log('Login.md is being read');
        res.render('login', {
          md: md,
          text: data.toString()
        });
      }
    });
  }
};

/**
 * The Local Strategy for logging in to BOLO
 */
passport.use(new LocalStrategy(function(username, password, done) {
  User.findUserByUsername(username, function(err, user) {
    if (err) {
      return done(err);
    }
    //If no user was found
    if (!user) {
      console.log('Username was not found');
      return done(null, false, {
        message: 'Username *' + username + '* was not found on the database'
      });
    }

    //if the agency is not active
    if (!user.agency.isActive) {
      return done(null, false, {
        message: 'Your Agency *' + user.agency.name + '* is Deactivated. Contact your Root Administrator for more information.'
      })
    }
    //if the user is not active
    //if (!user.isActive) {
    //    return done(null, false, {message: 'This user is currently deactivated'})
    //}
    User.comparePassword(password, user.password, function(err1, isValid) {
      if (err1) {
        console.log('comparePassword Error: ' + err1);
        return done(null, false, {
          message: 'Password Error! ' + 'Contact your Administrator if this messages persists'
        });
      }
      if (!isValid) {
        console.log('Password is incorrect');
        return done(null, false, {message: 'Password is incorrect'});
      }
      //If all checks pass, authorize user for the current session
      return done(null, user);
    });
  })
}));

/**
 * Process Username and Password for Login.
 */
exports.attemptLogIn = (passport.authenticate('local', {
  successRedirect: '/password',
  failureRedirect: '/login',
  failureFlash: true
}));

/**
 * Destroy any sessions belonging to the requesting client.
 */
exports.LogOut = function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are Logged Out');
  res.redirect('/login');
};

exports.renderForgotPasswordPage = function(req, res) {
  fs.readFile(__dirname + '/../public/Login.md', function(err, data) {
    if (err) {
      console.log('Login.md could not be read...\n' + err.stack);
      res.render('passwordForgotten', {
        md: md,
        text: 'Welcome'
      });
    } else {
      console.log('Login.md is being read');
      res.render('passwordForgotten', {
        md: md,
        text: data.toString()
      });
    }
  });
};

exports.postForgotPassword = function(req, res) {

  var nintydaysinMins = 129600;
  var todaysDate = new Date();
  var expiredLinkDate = new Date(todaysDate.getTime() + nintydaysinMins * 60000);

  //Save previous form
  var prevForm = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  }

  //Check if any fields are missing
  var missingFields = [];
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('firstname', 'First name is required').notEmpty();
  req.checkBody('lastname', 'Last name is required').notEmpty();

  var valErrors = req.validationErrors();
  for (var x in valErrors)
    missingFields.push(valErrors[x]);

  //If at least one error was found
  if (missingFields.length) {
    prevForm.errors = missingFields;
    fs.readFile(__dirname + '/../public/Login.md', function(err, data) {
      prevForm.md = md;
      if (err)
        prevForm.text = 'Welcome';
      else
        prevForm.text = data.toString();
      res.render('passwordForgotten', prevForm);
    });
  } else {

    User.findUserByEmail(req.body.email, function(err, user) {
      if (err) {
        console.log(err);
        req.flash('error_msg', 'Could not reset password at this time. Please contact the administrator to reset password.');
        res.redirect('/login');

      } else {
        //Validate the form for errors
        var formErrors = [];

        if (!user) {
          formErrors.push('Email address is not registered!');

        } else if ((user.firstname.toLowerCase() != req.body.firstname.toLowerCase()) || (user.lastname.toLowerCase() != req.body.lastname.toLowerCase())) {
          formErrors.push('Credentials do not match!');

        } else if (!user.isActive) {
          formErrors.push('Your account has been suspended. Please contact your agency administrator.');
          req.flash('error_msg', 'Your account has been suspended. Please contact your agency administrator.');
          res.redirect('/login');
        }

        //If at least one error was found
        if (formErrors.length) {
          prevForm.errors = formErrors;
          fs.readFile(__dirname + '/../public/Login.md', function(err, data) {
            prevForm.md = md;
            if (err)
              prevForm.text = 'Welcome';
            else
              prevForm.text = data.toString();
            res.render('passwordForgotten', prevForm);
          });
        } else {
          var token = crypto.randomBytes(20).toString('hex');
          user.resetPasswordExpires = expiredLinkDate;
          user.resetPasswordToken = token;

          user.save(function(err) {
            if (err) {
              req.flash('error_msg', 'Could not reset password at this time. Please contact the administrator to reset password.');
              res.redirect('/login');
            } else {
              sendResetPasswordEmail(user.email, token)
              req.flash('success_msg', 'Reset information successfully sent to ' + user.email);
              res.redirect('/login');
            }
          });
        }
      }

    });
  }
};

exports.getResetForgottenUserPass = function(req, res) {
  console.log("Reset Forgotten Pass");
  if (req.params.token) {
    User.findUserByToken(req.params.token, function(err, user) {
      if (err) {
        console.log('Could not find user by token: ' + token);
        req.flash('error_msg', 'Could not reset password at this time. Please contact the administrator to reset password.');
        res.redirect('/login');
      } else {
        //Check If the user's password token has expired
        var todaysDate = new Date();
        console.log("User Reset Password Expires Date: " + user.resetPasswordExpires);

        //If The user's password token has expired
        if (todaysDate.getTime() >= user.resetPasswordExpires.getTime()) {
          console.log("***The password is expired -- login.js 187");
          req.flash('error_msg', 'The link to reset password has expired. Please request a new password.');
          res.redirect('/forgotpassword');
        } else {
          res.render('passwordReset', {
            user: user,
            token: req.params.token
          });
        }
      }
    });
  } else {
    res.redirect('/login');
  }
};

/**
 * Sends an email to user to reset forgotten password
 *
 * @param email the user's email address
 * @param token the user's random generated token
 */
function sendResetPasswordEmail(email, token) {
  return emailService.send({
    'to': email,
    'from': config.email.from,
    'fromName': config.email.fromName,
    'subject': 'BOLO Alert: Reset password requested',
    'text': 'A password reset has been requested for the account registered to this email.\n' + 'To change your password, follow this link: \n\n' + config.appURL + '/forgotpassword/' + token + '\n\n' + 'If you did not request to change your password, please contact a system administrator and immediately change your password.'
  });
};
