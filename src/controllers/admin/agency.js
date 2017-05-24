'use strict';
var fs = require('fs');

var User = require("../../models/user.js");
var Agency = require('../../models/agency');

/**
 * Error handling for MongoDB
 */
var getErrorMessage = function(err) {
  var message = [];

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message.push({msg: 'Agency name already exists'});
        break;
      default:
        message.push({msg: "Something went wrong. Please check form for errors and try again"});
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message.push({msg: err.errors[errName].message});
      }
    }
  }
  return message;
};

/**
 * Respond with a list of agencies in the database
 */
exports.listAgencies = function(req, res, next) {
  Agency.findAllAgencies(function(err, agencies) {
    if (err)
      next(err);
    else {
      res.render('admin-agency', {agencies: agencies});
    }
  });
};

/**
 * Gets the details of an agency
 */
exports.getAgencyDetails = function(req, res, next) {
  Agency.findAgencyByID(req.params.id, function(err, agency) {
    if (err)
      next(err);
    else {
      res.render('admin-agency-details', {agency: agency});
    }
  });
};

/**
 * Activate an agency
 */
exports.activationAgency = function(req, res, next) {
  Agency.findAgencyByID(req.params.id, function(err, agency) {
    if (err)
      next(err);
    else {
      agency.isActive = !agency.isActive;
      agency.save(function(err) {
        if (err)
          next(err);
        else {
          var msg = agency.isActive
            ? 'activated'
            : 'deactivated';
          req.flash('success_msg', 'Agency *' + agency.name + '* is now ' + msg);
          res.redirect('/admin/agency/edit/' + req.params.id);
        }
      });
    }
  })
};

/**
 * Respond with a form to create an agency.
 */
exports.getCreateForm = function(req, res) {
  res.render('admin-agency-create');
};

/**
 * Process a form to create an agency.
 */
exports.postCreateForm = function(req, res) {
  console.log(req.files);

  //Validation
  var errors = [];
  req.checkBody('name', 'Agency Name is required').notEmpty();
  req.checkBody('domain', 'Domain is not valid').isDomain();
  req.checkBody('address', 'Address is required').notEmpty();
  req.checkBody('city', 'City is required').notEmpty();
  req.checkBody('state', 'State is required').notEmpty();
  req.checkBody('zip', 'Zip Code is required').notEmpty();
  req.checkBody('phone', 'A Phone Number is required').notEmpty();
  var valErrors = req.validationErrors();
  for (var x in valErrors)
    errors.push(valErrors[x]);

  //If a logo was not added in
  if (!req.files['logo']) {
    errors.push({msg: 'There needs to be a logo image'});
  }

  //If at least one error was found
  if (errors.length) {
    console.log('Error on validation');
    console.log(errors);

    //Render back the form with the entered information
    res.render('admin-agency-create', {
      errors: errors,
      name1: req.body.name,
      domain1: req.body.domain,
      address1: req.body.address,
      city1: req.body.city,
      state1: req.body.state,
      zip1: req.body.zip,
      phone1: req.body.phone
    }// If the form is valid
    );
  } else {
    var newAgency = new Agency({
      name: req.body.name,
      emailDomain: req.body.domain,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zip,
      phone: req.body.phone,
      rank: req.body.ranktitle,
      logo: {
        data: req.files['logo'][0].buffer,
        contentType: req.files['logo'][0].mimeType
      }
    });
    if (req.files['shield']) {
      newAgency.shield = {
        data: req.files['shield'][0].buffer,
        contentType: req.files['shield'][0].mimeType
      };
    }
    if (req.files['watermark']) {
      newAgency.watermark = {
        data: req.files['watermark'][0].buffer,
        contentType: req.files['watermark'][0].mimeType
      };
    }

    //Try to save agency
    newAgency.save(function(err, agency) {
      //Second Validation
      if (err) {
        console.log('Agency could not save');
        console.log(err.errors);

        res.render('admin-agency-create', {
          errors: getErrorMessage(err),
          name1: req.body.name,
          domain1: req.body.domain,
          address1: req.body.address,
          city1: req.body.city,
          state1: req.body.state,
          zip1: req.body.zip,
          phone1: req.body.phone
        }//If all validation passes
        );
      } else {
        console.log('Agency has been registered');

        req.flash('success_msg', 'Agency has been registered!');
        res.redirect('/admin/agency/create');
      }
    });
  }
};

/**
 * Respond with a form to edit agency details
 */
exports.getEditForm = function(req, res) {
  Agency.findAgencyByID(req.params.id, function(err, agency) {
    if (err)
      next(err);
    else {
      res.render('admin-agency-edit', {agency: agency});
    }
  });
};

/**
 * Process a form to edit/update agency details.
 */
exports.postEditForm = function(req, res) {
  console.log(req.body);
  console.log(req.files);

  var errors = [];
  if (req.body.domain)
    req.checkBody('domain', 'Domain is not valid').isDomain();
  var valErrors = req.validationErrors();
  for (var x in valErrors)
    errors.push(valErrors[x]);

  //If at least one error was found
  if (errors.length) {
    console.log('Error on validation');
    console.log(errors);

    //Render back the form with error
    req.flash('error_msg', errors[0].msg);
    res.redirect('/admin/agency/edit/' + req.params.id// If the form is valid
    );
  } else {
    Agency.findAgencyByID(req.params.id, function(err, agency) {
      if (err)
        next(err);
      else {
        //Update the agency
        if (req.body.name)
          agency.name = req.body.name;
        if (req.body.domain)
          agency.emailDomain = req.body.domain;
        if (req.body.address)
          agency.address = req.body.address;
        if (req.body.city)
          agency.city = req.body.city;
        if (req.body.state)
          agency.state = req.body.state;
        if (req.body.zip)
          agency.zipcode = req.body.zip;
        if (req.body.phone)
          agency.phone = req.body.phone;

        //Update and remove files
        if (req.files) {
          if (req.files['logo'])
            agency.logo = {
              data: req.files['logo'][0].buffer,
              contentType: req.files['logo'][0].mimeType
            };
          if (req.files['shield'])
            agency.shield = {
              data: req.files['shield'][0].buffer,
              contentType: req.files['shield'][0].mimeType
            };
          if (req.files['watermark'])
            agency.watermark = {
              data: req.files['watermark'][0].buffer,
              contentType: req.files['watermark'][0].mimeType
            };
        }

        console.log(agency);

        agency.save(function(err) {
          if (err) {
            console.log('Agency could not be updated');
            console.log(getErrorMessage(err)[0].msg);
            req.flash('error_msg', getErrorMessage(err)[0].msg);
            res.redirect('/admin/agency/edit/' + req.params.id);
          } else {
            console.log('Agency has been Updated');

            req.flash('success_msg', 'Agency has been Updated!');
            res.redirect('/admin/agency/edit/' + req.params.id);
          }
        });
      }
    })
  }
};

/**
 * Respond with a form to edit agency details
 */
exports.getEditForm = function(req, res, next) {
  Agency.findAgencyByID(req.params.id, function(err, agency) {
    if (err)
      next(err);
    else {
      res.render('admin-agency-edit', {agency: agency});
    }
  });
};

/**
 * Gets the delete agency conformation page
 */
exports.getDeleteAgency = function(req, res, next) {
  if (req.user.tier === 'ROOT') {
    Agency.findAgencyByID(req.params.id, function(err, agency) {
      if (err)
        next(err);
      else {
        User.findUsersByAgencyID(agency.id, function(err, listOfAgencyUsers) {
          if (err)
            next(err);
          else {
            res.render('admin-agency-delete', {
              agency: agency,
              users: listOfAgencyUsers
            });
          }
        })
      }
    });
  } else {
    res.render('unauthorized');
  }
};

/**
 * Deletes the agency
 */
exports.deleteAgency = function(req, res, next) {
  if (req.user.tier === 'ROOT') {
    User.comparePassword(req.body.password, req.user.password, function(err, result) {
      if (err)
        next(err);
      if (result) {
        Agency.findAgencyByID(req.params.id, function(err, agency) {
          if (err)
            next(err);

          //Delete All Users
          User.removeUsersByAgencyID(agency.id, function(err) {
            if (err)
              next(err);

            // Delete Agency
            var deletedAgencyName = agency.name;
            Agency.removeAgencyByID(agency.id, function(err) {
              if (err)
                next(err);
              req.flash('error_msg', 'Agency ' + deletedAgencyName + ' has been deleted');
              res.redirect('/admin/agency');
            });
          });
        });
      } else {
        req.flash('error_msg', 'Password was not correct');
        res.redirect('/admin/agency/delete/' + req.params.id);
      }
    })
  } else {
    res.render('unauthorized');
  }
};
