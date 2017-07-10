'use strict';

var fs = require('fs');
var uuid = require('node-uuid');
var crypto = require('crypto');

var config = require('../config');

var Bolo = require('../models/bolo');
var Agency = require('../models/agency');
var Category = require('../models/category');
var User = require('../models/user');

var emailService = require('../services/email-service');
var PDFDocument = require('pdfkit');
var pug = require('pug');

var converter = require('number-to-words');
var sizeOf = require('image-size');


function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
 }
/**
 * Error handling for MongoDB
 */
function getErrorMessage(err) {
  var message = [];

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message.push({msg: 'Bolo already exists?'});
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
}

/**
 * Sends an email to all subscribers of a bolo
 *
 * @param bolo
 * @param template
 * @param creatorEmail
 */
function sendBoloNotificationEmail(bolo, template) {
  console.log("THIS THE BOLO WE RECEIVED: " + bolo);
  Bolo.findBoloByID(bolo.id, function(err, boloToSend) {
    if (err)
      throw err;
    console.log("THIS THE BOLO WE ARE CONVERTING: " + boloToSend);
    var doc = new PDFDocument();
    /*
         ===================================================
         *         Begin Building The PDF Document         *
         ===================================================
         */

    //--------------GRAPHICS PORTION-----------------------

    //Write Agency Graphics if they exist to the PDF
    if (boloToSend.agency.watermark.data != undefined) {
      doc.image(boloToSend.agency.watermark.data, 0, 0, {
        fit: [800, 800]
      });
    }

    if (boloToSend.agency.logo.data != undefined) {
      doc.image(boloToSend.agency.logo.data, 15, 15, {height: 100});
    }
    if (boloToSend.agency.shield.data != undefined) {
      doc.image(boloToSend.agency.shield.data, 490, 15, {height: 100});
    }

	//Write BOLO Images based on how many images exist, to the PDF
	var onePhoto,
	  twoPhotos,
	  threePhotos;
	  
	 var oneTwo, three;

	//NO PICTURES
	if ((bolo.featured.data == undefined) && (bolo.other1.data == undefined) && (bolo.other2.data == undefined)) {
	  var noPic = appRoot + "/public/img/nopic.png";
	  doc.image(noPic, 170, 135, {
		width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).width,
		height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).height,
		align: 'center'
	  }).moveDown(5);
	  onePhoto, oneTwo =//Only Featured is present
	  true;
	} else if ((bolo.other1.data == undefined) && (bolo.other2.data == undefined)) {
	  doc.image(bolo.featured.data, 210, 135, {
		width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).width,
		height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).height,
		align: 'center'
	  }).moveDown(5);
	  onePhoto, oneTwo =// Only Featured and Other1 are present
	  true;
	} else if ((bolo.other1.data != undefined) && (bolo.other2.data == undefined)) {
	  doc.image(bolo.featured.data, 320, 135, {
		width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).width,
		height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).height,
		align: 'center'
	  }).moveDown(5);

	  doc.image(bolo.other1.data, 30, 135, {
		width: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 270, 210).width,
		height: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 270, 210).height,
		align: 'left'
	  }).moveDown(5);
	  twoPhotos, oneTwo =// Only Featured and Other2 are present
	  true;
	} else if ((bolo.other2.data != undefined) && (bolo.other1.data == undefined)) {
	  doc.image(bolo.featured.data, 30, 135, {
		width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).width,
		height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).height,
		align: 'center'
	  }).moveDown(5);

	  doc.image(bolo.other2.data, 320, 135, {
		width: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 270, 210).width,
		height: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 270, 210).height,
		align: 'left'
	  }).moveDown(5);
	  twoPhotos, oneTwo =// All Images are present
	  true;
	} else if ((bolo.other1.data != undefined) && (bolo.other2.data != undefined)) {
	  doc.image(bolo.featured.data, 228, 135, {
		width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 170, 110).width,
		height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 170, 110).height,
		align: 'center'
	  }).moveDown(5);

	  doc.image(bolo.other1.data, 40, 135, {
		width: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 170, 110).width,
		height: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 170, 110).height,
		align: 'left'
	  }).moveDown(5);

	  doc.image(bolo.other2.data, 415, 135, {
		width: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 170, 110).width,
		height: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 170, 110).height,
		align: 'right'
	  }).moveDown(5);
	  threePhotos = true;
	  three = true;
	}

    //--------------TEXT PORTION-----------------------

    //Write headers and Police Department Information to the PDF Document
    doc.fontSize(10);
    doc.font('Times-Roman');
    doc.fillColor('red');
    doc.text("UNCLASSIFIED// FOR OFFICIAL USE ONLY// LAW ENFORCEMENT SENSITIVE", 85, 15, {align: 'center'}).moveDown(0.25);
    doc.fillColor('black');
    doc.text(boloToSend.agency.name + " Police Department", {align: 'center'}).moveDown(0.25);
    doc.text(boloToSend.agency.address, {align: 'center'}).moveDown(0.25);
    doc.text(boloToSend.agency.city + ", " + boloToSend.agency.state + ", " + boloToSend.agency.zipcode, {align: 'center'}).moveDown(0.25);
    doc.text(boloToSend.agency.phone, {align: 'center'}).moveDown(0.25);
    doc.fontSize(20);
    doc.fillColor('red');

    //Write Category and BOLO status to the PDF Document
    doc.fontSize(23);
    Category.findCategoryByID(bolo.category, function(err, boloCategory) {
      if (bolo.status !== 'ACTIVE') {
        if (onePhoto) {
          doc.fillColor('black');
          doc.text(boloCategory.name, 85, 100, {align: 'center'}); //original 100, 140
          doc.fontSize(80);
          doc.fillColor('red');
          doc.text(bolo.status, 110, 210, {align: 'center'}).moveDown();
        }
        if (twoPhotos) {
          doc.fillColor('black');
          doc.text(boloCategory.name, 85, 100, {align: 'center'}); //original 100, 140
          doc.fontSize(80);
          doc.fillColor('red');
          doc.text(bolo.status, 120, 210, {align: 'center'}).moveDown();
        }
        if (threePhotos) {
          doc.fillColor('black');
          doc.text(boloCategory.name, 85, 100, {align: 'center'}); //original 100, 140
          doc.fontSize(80);
          doc.fillColor('red');
          doc.text(bolo.status, 120, 150, {align: 'center'}).moveDown();
        }

        doc.end();
      } else {
        if (onePhoto) {
          doc.fillColor('red');
          doc.text(boloCategory.name + " -- " + bolo.status, 85, 100, {align: 'center'}). //original 100, 140
          moveDown(11);
        }
        if (twoPhotos) {
          doc.fillColor('red');
          doc.text(boloCategory.name + " -- " + bolo.status, 85, 100, {align: 'center'}). //original 100, 140
          moveDown(5);
        }

        if (threePhotos) {
          doc.fillColor('red');
          doc.text(boloCategory.name + " -- " + bolo.status, 85, 100, {align: 'center'}). //original 100, 140
          moveDown();
        }

        doc.text("A BOLO has been issued! Details have been purposely hidden for security.",100, 400, {align: 'center'}).moveDown(0.50);
        doc.text("Please login to the BOLO database to view the full details of this BOLO.",100, 470, {align: 'center'}).moveDown(0.50);
        doc.end();
      }
    });

    User.findAllUsers(function(err, users) {
      if (err) {
        console.log("Error finding all users...\n" + err);
      } else {
        var tmp = config.email.template_path + '/' + template + '.pug';
        var tdata = {
          'bolo': bolo,
          'app_url': config.appURL
        };

        // todo check if this is async
        var html = pug.renderFile(tmp, tdata);

        var emails = [];

        if (template === 'update-bolo-notification') {
          emails = boloToSend.subscribers;
        }

        //Find all users subscribed to agency and subscribes them to the bolo
        if (template === 'new-bolo-notification') {
          users.forEach(function(entry) {
            console.log(entry.agencySubscriber);
            if (entry.agencySubscriber.indexOf(boloToSend.agency._id.toString()) >= 0) {
              emails.push(entry.email);
              Bolo.subscribeToBOLO(boloToSend._id, entry.email, function(err) {
                if (err) {
                  console.log("Error subscribing bolo...\n" + err);
                } else {
                  console.log(entry.username);
                }
              });
            }

          });
        }

        console.log("SENDING EMAIL SUCCESSFULLY");
        console.log(emails);
        User.findUserByID(boloToSend.author, function(err, creator) {
          console.log(emails);
          if (err)
            console.log('Error while finding Bolo author.... \n' + err);
          else {
            emailService.send({
              'to': creator.email,
              'bcc': emails,
              'from': config.email.from,
              'fromName': config.email.fromName,
              'subject': 'BOLO Alert: ' + boloToSend.category.name,
              'html': html,
              'files': [
                {
                  content: doc,
                  filename: tdata.bolo.id + '.pdf', // required only if file.content is used.
                  contentType: 'application/pdf' // optional
                }
              ]
            }).catch(function(error) {
              console.error('Unknown error occurred while sending notifications to users' +
                'subscribed to agency id %s for BOLO %s\n %s',
              bolo.agency, bolo.id, error.message);
              console.error(error);
            });
          }
        });

      }
    })
  })
}

/**
 * Sends an email to all subscribers of a bolo
 *
 * @param bolo
 * @param template
 */
/*
 function sendBoloToDataSubscriber(bolo, template) {
 var someData = {};
 console.log('in email function');
 boloService.getAttachment(bolo.id, 'featured').then(function (attDTO) {
 someData.featured = attDTO.data;
 return dataSubscriberService.getDataSubscribers('all_active')
 .then(function (dataSubscribers) {
 // filters out Data Subscribers and pushes their emails into array
 var subscribers = dataSubscribers.map(function (dataSubscriber) {
 console.log(dataSubscriber.email);
 return dataSubscriber.email;
 });
 var tmp = config.email.template_path + '/' + template + '.jade';
 var tdata = {
 'bolo': bolo,
 'app_url': config.appURL
 };
 var html = jade.renderFile(tmp, tdata);
 console.log("SENDING EMAIL TO SUBSCRIBERS SUCCESSFULLY");
 return emailService.send({
 'to': subscribers,
 'from': config.email.from,
 'fromName': config.email.fromName,
 'subject': 'BOLO Alert: ' + bolo.category,
 'html': html,
 'files': [{
 filename: tdata.bolo.id + '.jpg', // required only if file.content is used.
 contentType: 'image/jpeg', // optional
 content: someData.featured
 }]
 });
 })
 .catch(function (error) {
 console.error('Error occurred while sending notifications to subscriber: ' + dataSubscriber);
 console.error(error);
 });
 })
 }
 */

/**
 * Sends an email to the logged in user to confirm a created bolo
 *
 * @param email the users email address
 * @param firstname the users first name
 * @param lastname the users last name
 * @param token the bolo's random generated token
 */
function sendBoloConfirmationEmail(email, firstname, lastname, token) {

  emailService.send({
    'to': email,
    'from': config.email.from,
    'fromName': config.email.fromName,
    'subject': 'BOLO Alert: Confirm BOLO ' + firstname + " " + lastname,
    'text': 'Your BOLO was created but not confirmed. \n' + 'Click on the link below to confirm: \n\n' + config.appURL + '/bolo/confirm/' + token + '\n\n'
  })
}

/**
 * Sends an email to the loggedin user to confirm an updated bolo
 *
 * @param email the users email address
 * @param firstname the users first name
 * @param lastname the users last name
 * @param token the bolo's random generated token
 */
function sendBoloUpdateConfirmationEmail(email, firstname, lastname, token) {
  emailService.send({
    'to': email,
    'from': config.email.from,
    'fromName': config.email.fromName,
    'subject': 'BOLO Alert: Confirm BOLO ' + firstname + " " + lastname,
    'text': 'Your BOLO was updated but not confirmed. \n' + 'Click on the link below to confirm: \n\n' + config.appURL + '/bolo/confirm/' + token + '\n\n'
  })
}

/**
 * List active bolos based on query
 */
exports.listBolos = function(req, res, next) {
  console.log("READING");
  console.log(req.query);
  const limit = config.const.BOLOS_PER_QUERY;
  const filter = req.query.filter || 'allBolos';
  const isArchived = req.query.archived || false;
  const agency = req.query.agency || '';
  const onlyMyAgencyInternals = req.query.onlyMyAgencyInternals;
  const tier = req.user.tier;
  switch (filter) {
    case 'allBolos':
      Bolo.findAllBolos(tier, req, true, isArchived, limit, 'createdOn', function(err, listOfBolos) {
        if (err)
          console.log(err);
        else {
          res.render('partials/bolo-thumbnails', {bolos: listOfBolos});
        }
      });
      break;
    case 'myAgency':
      Bolo.findBolosByAgencyID(tier, req, req.user.agency, true, isArchived, limit, 'createdOn', function(err, listOfBolos) {
        if (err)
          console.log(err);
        else {
          res.render('partials/bolo-thumbnails', {bolos: listOfBolos});
        }
      });
      break;
    case 'internal':
      Bolo.findBolosByInternal(tier, req, true, isArchived, limit, 'createdOn', onlyMyAgencyInternals, function(err, listOfBolos) {
        if (err)
          console.log(err);
        else {
          res.render('partials/bolo-thumbnails', {bolos: listOfBolos});
        }
      });
      break;
    case 'myBolos':
      Bolo.findBolosByAuthor(req.user.id, true, isArchived, limit, 'createdOn', function(err, listOfBolos) {
        if (err)
          console.log(err);
        else {
          res.render('partials/bolo-thumbnails', {bolos: listOfBolos});
        }
      });
      break;
    case 'selectedAgency':
      Bolo.findBolosByAgencyID(tier, req, agency, true, isArchived, limit, 'createdOn', function(err, listOfBolos) {
        if (err)
          console.log(err);
        else {
          res.render('partials/bolo-thumbnails', {bolos: listOfBolos});
        }
      });
      break;
    default:
      Bolo.findAllBolos(req, true, isArchived, limit, 'createdOn', function(err, listOfBolos) {
        if (err)
          console.log(err);
        else {
          console.log('Error! default case was called');
          res.render('partials/bolo-thumbnails', {bolos: listOfBolos});
        }
      });
      break;
  }
};

/**
 * Gets the bolo view
 */
exports.renderBoloPage = function(req, res, next) {
  Agency.findAllAgencies(function(err, listOfAgencies) {
    if (err)
      console.log(err);
    else {
      res.render('bolo', {agencies: listOfAgencies, isRoot: res.locals.userTier === 'ROOT'});
    }
  });
};

/**
 * Handle requests to view the details of a bolo
 */
exports.getBoloDetails = function(req, res, next) {
  // Check if ObjectId is valid
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Bolo.findBoloByID(req.params.id, function(err, bolo) {
      if (err) {
        console.log(err);
      } else {
        if (!bolo) {
          req.flash('error_msg', 'Bolo ' + req.params.id + ' could not be found');
          res.redirect('/bolo');
        } else {
          Bolo.findIfEmailIsInBolo(req.params.id, req.user.email, function(err, boloFound) {
            if (err) {
              console.log(err);
            } else {
              console.log(boloFound);
              res.render('bolo-details', {
                bolo: bolo,
                isSubscribed: boloFound
              });
            }
          });
        }
      }
    });
  } else {
    next();
  }
};

exports.subscribeToBOLO = function(req, res, next) {
  Bolo.subscribeToBOLO(req.params.id, req.user.email, function(err) {
    if (err) {
      console.log(err);
    } else {
      req.flash('success_msg', 'You are now Subscribed');
      res.redirect('/bolo/' + req.params.id);
    }
  });
};

exports.unsubscribeFromBOLO = function(req, res, next) {
  Bolo.unsubscribeFromBOLO(req.params.id, req.user.email, function(err) {
    if (err) {
      console.log(err);
    } else {
      req.flash('error_msg', 'You are now UnSubscribed');
      res.redirect('/bolo/' + req.params.id);
    }
  });
};

/**
 * Renders the Bolo as a PDF for Printing and Saving
 */
exports.renderBoloAsPDF = function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Bolo.findBoloByID(req.params.id, function(err, bolo) {
      if (err)
        console.log(err);
      else if (!bolo) {
        req.flash('error_msg', 'Bolo ' + req.params.id + ' could not be found');
        res.redirect('/bolo');
      } else {
        //req.flash('error_msg', 'Not yet Implemented');
        //res.redirect('/bolo');
        //Variable and Object Declaration
        var doc = new PDFDocument();
		var oneTwo, three = false;


        /*
                 ===================================================
                 *            GET AGENCY DEPENDENT ITEMS           *
                 ===================================================
                 */
        Agency.findAgencyByID(bolo.agency.id, function(err, agency) {
          if (err)
            throw err;

          /*
                     ===================================================
                     *         Begin Building The PDF Document         *
                     ===================================================
                     */

          //--------------GRAPHICS PORTION-----------------------
          var errorFlag = false;
          try {
            //Write Agency Graphics if they exist to the PDF
            if (agency.watermark.data != undefined) {
              doc.image(agency.watermark.data, 0, 0, {
                fit: [800, 800]
              });
            }
            if (agency.logo.data != undefined) {
              doc.image(agency.logo.data, 15, 15, {height: 100});
            }
            if (agency.shield.data != undefined) {
              doc.image(agency.shield.data, 490, 15, {height: 100});
            }

            //Write BOLO Images based on how many images exist, to the PDF
            var onePhoto,
              twoPhotos,
              threePhotos;

            //NO PICTURES
            if ((bolo.featured.data == undefined) && (bolo.other1.data == undefined) && (bolo.other2.data == undefined)) {
              var noPic = appRoot + "/public/img/nopic.png";
              doc.image(noPic, 170, 135, {
                width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).width,
                height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).height,
                align: 'center'
              }).moveDown(5);
              onePhoto, oneTwo =//Only Featured is present
              true;
            } else if ((bolo.other1.data == undefined) && (bolo.other2.data == undefined)) {
              doc.image(bolo.featured.data, 210, 135, {
                width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).width,
                height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 290, 230).height,
                align: 'center'
              }).moveDown(5);
              onePhoto, oneTwo =// Only Featured and Other1 are present
              true;
            } else if ((bolo.other1.data != undefined) && (bolo.other2.data == undefined)) {
              doc.image(bolo.featured.data, 320, 135, {
                width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).width,
                height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).height,
                align: 'center'
              }).moveDown(5);

              doc.image(bolo.other1.data, 30, 135, {
                width: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 270, 210).width,
                height: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 270, 210).height,
                align: 'left'
              }).moveDown(5);
              twoPhotos, oneTwo =// Only Featured and Other2 are present
              true;
            } else if ((bolo.other2.data != undefined) && (bolo.other1.data == undefined)) {
              doc.image(bolo.featured.data, 30, 135, {
                width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).width,
                height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 270, 210).height,
                align: 'center'
              }).moveDown(5);

              doc.image(bolo.other2.data, 320, 135, {
                width: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 270, 210).width,
                height: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 270, 210).height,
                align: 'left'
              }).moveDown(5);
              twoPhotos, oneTwo =// All Images are present
              true;
            } else if ((bolo.other1.data != undefined) && (bolo.other2.data != undefined)) {
              doc.image(bolo.featured.data, 228, 135, {
                width: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 170, 110).width,
                height: calculateAspectRatioFit(bolo.featured.width, bolo.featured.height, 170, 110).height,
                align: 'center'
              }).moveDown(5);

              doc.image(bolo.other1.data, 40, 135, {
                width: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 170, 110).width,
                height: calculateAspectRatioFit(bolo.other1.width, bolo.other1.height, 170, 110).height,
                align: 'left'
              }).moveDown(5);

              doc.image(bolo.other2.data, 415, 135, {
                width: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 170, 110).width,
                height: calculateAspectRatioFit(bolo.other2.width, bolo.other2.height, 170, 110).height,
                align: 'right'
              }).moveDown(5);
              threePhotos = true;
			  three = true;
            }
          } catch (err) {
            errorFlag = err;
          }
          if (errorFlag) {
            next(errorFlag)
          } else {
            //--------------TEXT PORTION-----------------------

            //Write headers and Police Department Information to the PDF Document
            doc.fontSize(10);
            doc.font('Times-Roman');
            doc.fillColor('red');
            doc.text("UNCLASSIFIED// FOR OFFICIAL USE ONLY// LAW ENFORCEMENT SENSITIVE", 85, 15, {align: 'center'}).moveDown(0.25);
            doc.fillColor('black');
            doc.text(agency.name + " Police Department", {align: 'center'}).moveDown(0.25);
            doc.text(agency.address, {align: 'center'}).moveDown(0.25);
            doc.text(agency.city + ", " + agency.state + ", " + agency.zipcode, {align: 'center'}).moveDown(0.25);
            doc.text(agency.phone, {align: 'center'}).moveDown(0.25);
            doc.fontSize(20);
            doc.fillColor('red');

            //Write Category and BOLO status to the PDF Document
            doc.fontSize(23);
            if (bolo.status !== 'ACTIVE') {
              if (onePhoto) {
                doc.fillColor('black');
                doc.text(bolo.category.name, 85, 100, {align: 'center'}); //original 100, 140
                doc.fontSize(80);
                doc.fillColor('red');
                doc.text(bolo.status, 110, 210, {align: 'center'}).moveDown(11);
              }
              if (twoPhotos) {
                doc.fillColor('black');
                doc.text(bolo.category.name, 85, 100, {align: 'center'}); //original 100, 140
                doc.fontSize(80);
                doc.fillColor('red');
                doc.text(bolo.status, 120, 210, {align: 'center'}).moveDown(10);
              }
              if (threePhotos) {
                doc.fillColor('black');
                doc.text(bolo.category.name, 85, 100, {align: 'center'}); //original 100, 140
                doc.fontSize(80);
                doc.fillColor('red');
                doc.text(bolo.status, 120, 150, {align: 'center'}).moveDown(5);
              }
            } else {
              if (onePhoto) {
                doc.fillColor('red');
                doc.text(bolo.category.name + " -- " + bolo.status, 85, 100, {align: 'center'}). //original 100, 140
                moveDown(11);
              }
              if (twoPhotos) {
                doc.fillColor('red');
                doc.text(bolo.category.name + " -- " + bolo.status, 85, 100, {align: 'center'}). //original 100, 140
                moveDown(10);
              }

              if (threePhotos) {
                doc.fillColor('red');
                doc.text(bolo.category.name + " -- " + bolo.status, 85, 100, {align: 'center'}). //original 100, 140
                moveDown(5);
              }

            }

            //bolo details
            if(three){
				doc.fontSize(11);
				doc.fillColor('black');
				doc.fontSize(11);
			}
			else
			{
				doc.fontSize(9);
				doc.fillColor('black');
				doc.fontSize(9);
			}

            if(oneTwo){
				doc.font('Times-Roman').text("Bolo ID: ", 50, 380).moveUp().text(bolo.id, 100, 380).moveDown();
			}
			else{
				doc.font('Times-Roman').text("Bolo ID: ", 50,250).moveUp().text(bolo.id, 100,250).moveDown();
			}

			var field_info = "";

            //Write all of the fields and details to the PDF Document
            for (var i = 0; i < bolo.fields.length; i++) {
              console.log("I am trying to print the text!");
              console.log("The index is: " + i + " -- At this index the element is: " + bolo.fields[i]);
			  if(bolo.fields[i] !== "N/A"){
				  field_info += bolo.category.fields[i] + ": " + bolo.fields[i] + "\n\n";
			  }
			  /*
              if (bolo.fields[i] !== "N/A") {
                if(i == 1 && bolo.info !== "")
				{
					doc.fillColor('black');
					doc.fontSize(10);
					doc.font('Times-Roman').text(bolo.category.fields[i] + ": ", 50).moveUp().text(bolo.fields[i], 225).moveDown();
				}
				else if(i == 1)
				{
					doc.fillColor('black');
					doc.fontSize(10);
					doc.font('Times-Roman').text(bolo.category.fields[i] + ": ", 50).moveUp().text(bolo.fields[i], 225).moveDown();
				}
				else
				{
					doc.fillColor('black');
					doc.fontSize(10);
					doc.font('Times-Roman').text(bolo.category.fields[i] + ": ", 50).moveUp().text(bolo.fields[i], 225).moveDown();
				}
              }
			  */

            }
			if(oneTwo)
			{
				doc.font('Times-Roman').text(field_info, 50, 400).moveDown();
			}
			else
			{
				doc.font('Times-Roman').text(field_info, 50, 270).moveDown();
			}



            //Write Additional Details
            doc.font('Times-Roman').text(" ", 50).moveDown();

            doc.font('Times-Bold').text("Created: " + bolo.createdOn, 50, null, {width: 200}).moveDown();

            /*
                         //For Data Analysis Recovered
                         if(data.bolo['dateRecovered'] !== ""){
                         doc.font('Times-Roman')
                         .text("Date Recovered: " + data.bolo['dateRecovered'], 200)
                         .moveDown(0.25);
                         }
                         if(data.bolo['timeRecovered'] !== ""){
                         doc.font('Times-Roman')
                         .text("Time Recovered: " + data.bolo['timeRecovered'], 200)
                         .moveDown(0.25);
                         }
                         if(data.bolo['addressRecovered'] !== ""){
                         doc.font('Times-Roman')
                         .text("Address Recovered: " + data.bolo['addressRecovered'], 200)
                         .moveDown(0.25);
                         }
                         if(data.bolo['zipCodeRecovered'] !== ""){
                         doc.font('Times-Roman')
                         .text("Zip Code Recovered: " + data.bolo['zipCodeRecovered'], 200)
                         .moveDown(0.25);
                         }
                         if(data.bolo['agencyRecovered'] !== ""){
                         doc.font('Times-Roman')
                         .text("Agency Recovered: " + data.bolo['agencyRecovered'], 200)
                         .moveDown();
                         }
                         */

            // Display Additional Information only if there is a value in it
            if (bolo.info !== "" && bolo.summary == "") {
              if(oneTwo)
			  {
				  doc.font('Times-Bold').text("Additional: ", 350, 380, {align: 'left'}).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.info, {width: 200}).moveDown();
			  }
			  else
			  {
				  doc.font('Times-Bold').text("Additional: ", 350, 250, {align: 'left'}).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.info, {width: 200}).moveDown();
			  }
            }
			else if(bolo.info == "" && bolo.summary !== "")
			{
			  if(oneTwo)
			  {
				doc.font('Times-Bold').text("Summary: ", 350, 480).moveDown(0.25);
				doc.font('Times-Roman').text(bolo.summary, {width: 200}).moveDown();
			  }
			  else
			  {
				  doc.font('Times-Bold').text("Summary: ", 350, 350).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.summary, {width: 200}).moveDown();
			  }
			}
			else if(bolo.info !== "" && bolo.summary !== "")
			{
			  if(oneTwo)
			  {
				  doc.font('Times-Bold').text("Additional: ", 350, 380, {align: 'left'}).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.info, {width: 200}).moveDown(1);
				  doc.font('Times-Bold').text("Summary: ", 350).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.summary, {width: 200}).moveDown();
			  }
			  else
			  {
				  doc.font('Times-Bold').text("Additional: ", 350, 250, {align: 'left'}).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.info, {width: 200}).moveDown(1);
				  doc.font('Times-Bold').text("Summary: ", 350).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.summary, {width: 200}).moveDown();
			  }
			}

			/*
            // Display a Summary only if there is a value in it
            if (bolo.summary !== "") {
              if(oneTwo)
			  {
				doc.font('Times-Bold').text("Summary: ", 350, 480).moveDown(0.25);
				doc.font('Times-Roman').text(bolo.summary, {width: 200}).moveDown();
			  }
			  else
			  {
				  doc.font('Times-Bold').text("Summary: ", 350, 350).moveDown(0.25);
				  doc.font('Times-Roman').text(bolo.summary, {width: 200}).moveDown();
			  }
            }
			*/
            doc.font('Times-Bold').text("This BOLO was created by: " + bolo.author.unit + " " + bolo.author.rank + " " + bolo.author.firstname + " " + bolo.author.lastname).moveDown(0.25);
            doc.font('Times-Bold').text("Please contact the agency should clarification be required.", {width: 200});

            //End Document and send it to the front end via res
            doc.end();
            res.contentType("application/pdf");
            doc.pipe(res);
          }
        });
      }
    })
  } else {
    next();
  }

};

/**
 * Renders the bolo create form
 */
exports.getCreateBolo = function(req, res) {
  Category.findAllCategories(function(err, listOfCategories) {
    if (err) {
      req.flash('error_msg', 'Could not load the Categories on the database');
      res.redirect('/bolo');
    } else {
      res.render('bolo-create', {categories: listOfCategories});
    }
  })
};

/**
 * Creates a BOLO
 */
exports.postCreateBolo = function(req, res, next) {

  Category.findAllCategories(function(err, listOfCategories) {
    if (err) {
      req.flash('error_msg', 'Could not find categories');
      res.redirect('/bolo/create');
    } else {
      //Holds previously entered form data
      var prevForm = {
        dateReported1: req.body.dateReported,
        timeReported1: req.body.timeReported,
        vid1: req.body.videoURL,
        info1: req.body.info,
        summary1: req.body.summary,
        categories: listOfCategories,
        internal1: (req.body.internal)
          ? true
          : false
      };

      //Validation of form
      var errors = [];
      req.checkBody('category', 'Please select a category').notEmpty();
      req.checkBody('dateReported', 'Please enter a date').notEmpty();
      req.checkBody('timeReported', 'Please enter a time').notEmpty();
      var valErrors = req.validationErrors();
      for (var x in valErrors)
        errors.push(valErrors[x]);

      //Create a date object using date and time reported
      const reportedDate = req.body.dateReported.split('/');
      const reportedTime = req.body.timeReported.split(':');
      console.log(reportedDate[0] + " " + reportedDate[1] + "\n");
      const newDate = new Date(reportedDate[2], reportedDate[0], reportedDate[1] - 1, reportedTime[0], reportedTime[1], 0, 0);

      //Make sure that no word inside Summary is longer than 38 characters(it would break format otherwise)
      var splitSummary =  req.body.summary.split(" ");
      var totalSummary = "";
      var wordInSummary = "";
      for (var i = 0; i < splitSummary.length; i++){
          for (var j = 0; j < splitSummary[i].length; j++){
              wordInSummary = wordInSummary + splitSummary[i].charAt(j);
              if (j % 37 == 0 && j != 0){
                wordInSummary = wordInSummary + " ";
              }
          }
          totalSummary = totalSummary + wordInSummary + " ";
          wordInSummary = "";
      }

      //Do the same for Additional info
      var splitInfo =  req.body.info.split(" ");
      var totalInfo = "";
      var wordInInfo = "";
      for (var i = 0; i < splitInfo.length; i++){
          for (var j = 0; j < splitInfo[i].length; j++){
              wordInInfo = wordInInfo + splitInfo[i].charAt(j);
              if (j % 37 == 0 && j != 0){
                wordInInfo = wordInInfo + " ";
              }
          }
          totalInfo = totalInfo + wordInInfo + " ";
          wordInInfo = "";
      }


      if (isNaN(newDate.getTime()))
        errors.push('Please Enter a Valid Date');

      Category.findCategoryByName(req.body.category, function(err, category) {
        if (err)
          console.log(err);

        if (category == null)
          errors.push('Please select a category');

        // If there are errors
        if (errors.length) {
          console.log("Validation errors:" + errors);

          //Render back page
          prevForm.errors = errors;
          res.render('bolo-create', prevForm//If no errors were found
          );
        } else {
          const token = crypto.randomBytes(20).toString('hex');
          var newBolo = new Bolo({
            author: req.user.id,
            agency: req.user.agency.id,
            internal: (req.body.internal)
              ? true
              : false,
            reportedOn: newDate,
            category: category.id,
            videoURL: req.body.videoURL,
            info: totalInfo,
            summary: totalSummary,
            conformationToken: token,
            boloToDelete: 'N/A',
            status: 'ACTIVE',
            fields: req.body.field
          });
          // console.log('req.body.field: ' + req.body.field);
          // newBolo.fields = req.body.field.map(field => field.toLowerCase());
          // console.log(newBolo.fields);
          for (var i in newBolo.fields) {
            if (newBolo.fields[i] === '') {
              newBolo.fields[i] = 'N/A';
            }
          }
          var buffer = {
            featured: {},
            other1: {},
            other2: {}
          };

          if (req.files['featured']) {
            if (req.body.compressedFeatured) {
              console.log('Using compressed featured image');
			  var dimensions = sizeOf(req.files['featured'][0].buffer);
			  console.log('Width of featured is' + dimensions.width + ' and height is' + dimensions.height);
              newBolo.featured = {
                data: req.body.compressedFeatured,
                contentType: 'image/jpg',
				width: dimensions.width,
				height: dimensions.height
              };
            } else {
              console.log('Using original featured image');
			  var dimensions = sizeOf(req.files['featured'][0].buffer);
			  console.log('Width of featured is' + dimensions.width + ' and height is' + dimensions.height);
              newBolo.featured = {
                data: req.files['featured'][0].buffer,
                contentType: req.files['featured'][0].mimeType,
				width: dimensions.width,
				height: dimensions.height
              };
            }
            buffer.featured.data = req.files['featured'][0].buffer.toString('base64');
            buffer.featured.contentType = req.files['featured'][0].mimeType;
          }
          if (req.files['other1']) {
            if (req.body.compressedOther1) {
              console.log('Using compressed other1 image');
			  var dimensions = sizeOf(req.files['other1'][0].buffer);
			  console.log('Width of other1 is' + dimensions.width + ' and height is' + dimensions.height);
              newBolo.other1 = {
                data: req.body.compressedOther1,
                contentType: 'image/jpg',
				width: dimensions.width,
				height: dimensions.height
              };
            } else {
              console.log('Using original other1 image');
			  var dimensions = sizeOf(req.files['other1'][0].buffer);
			  console.log('Width of other1 is' + dimensions.width + ' and height is' + dimensions.height);
              newBolo.other1 = {
                data: req.files['other1'][0].buffer,
                contentType: req.files['other1'][0].mimeType,
				width: dimensions.width,
				height: dimensions.height
              };
            }
            buffer.other1.data = req.files['other1'][0].buffer.toString('base64');
            buffer.other1.contentType = req.files['other1'][0].mimeType;
          }
          if (req.files['other2']) {
            if (req.body.compressedOther2) {
              console.log('Using compressed other2 image');
			  var dimensions = sizeOf(req.files['other2'][0].buffer);
			  console.log('Width of other2 is' + dimensions.width + ' and height is' + dimensions.height);
              newBolo.other2 = {
                data: req.body.compressedOther2,
                contentType: 'image/jpg',
				width: dimensions.width,
				height: dimensions.height
              };
            } else {
              console.log('Using original other2 image');
			  var dimensions = sizeOf(req.files['other2'][0].buffer);
			  console.log('Width of other2 is' + dimensions.width + ' and height is' + dimensions.height);
              newBolo.other2 = {
                data: req.files['other2'][0].buffer,
                contentType: req.files['other2'][0].mimeType,
				width: dimensions.width,
				height: dimensions.height
              };
            }
            buffer.other2.data = req.files['other2'][0].buffer.toString('base64');
            buffer.other2.contentType = req.files['other2'][0].mimeType;
          }

          if (req.body.option === "preview") {
            Agency.findAgencyByID(req.user.agency.id, function(err, agency) {
              console.log('newBolo' + newBolo);
              res.render('bolo-preview', {
                bolo: newBolo,
                category: category,
                agency: agency,
                buffer: buffer
              });
            })
          } else {
            newBolo.save(function(err) {
              if (err) {
                prevForm.errors = getErrorMessage(err);
                res.render('bolo-create', prevForm);
              } else {
                console.log(newBolo);
                console.log('Sending email using Sendgrid');
                sendBoloConfirmationEmail(req.user.email, req.user.firstname, req.user.lastname, token);
                req.flash('success_msg', 'BOLO successfully created, Please check your email in order to confirm it.');
                res.redirect('/bolo');
              }
            });
          }
        }
      })
    }
  })
};

/**
 * Confirms an emailed Bolo for a logged out user
 */
exports.loggedOutConfirmBolo = function(req, res, next) {
  if (!req.user) {
    Bolo.findBoloByToken(req.params.token, function(err, boloToConfirm) {
      if (err)
        console.log(err);
      else {
        if (!boloToConfirm) {
          req.flash('error_msg', 'Bolo to confirm was not found on the database');
          res.redirect('/login');
        } else if (boloToConfirm.isConfirmed === true) {
          req.flash('error_msg', 'That Bolo was already confirmed');
          res.redirect('/login');
        } else if (boloToConfirm.boloToDelete != 'N/A') {
          //Find original BOLO
          Bolo.findBoloByID(boloToConfirm.boloToDelete, function(err, originalBolo) {
            if (err)
              console.log(err);
            else {
              if (!originalBolo) {
                //Delete new BOLO if original cannot be found
                Bolo.deleteBolo(boloToConfirm.id, function(err) {
                  if (err)
                    console.log(err);
                  else {
                    req.flash('error_msg', 'Bolo to confirm was not found on the database');
                    res.redirect('/bolo');
                  }
                });
              } else {
                //Delete original BOLO
                Bolo.deleteBolo(boloToConfirm.boloToDelete, function(err) {
                  if (err)
                    console.log(err);
                  else {
                    boloToConfirm.boloToDelete = 'N/A';
                    boloToConfirm.isConfirmed = true;
                    boloToConfirm.save(function(err) {
                      if (err)
                        console.log(err);
                      else {
                        sendBoloNotificationEmail(boloToConfirm, 'update-bolo-notification');
                        req.flash('success_msg', 'Bolo has been confirmed');
                        res.redirect('/bolo');
                      }
                    });
                  }
                });
              }
            }
          });
        } else {
          boloToConfirm.isConfirmed = true;
          boloToConfirm.save(function(err) {
            if (err)
              console.log(err);
            else {
              sendBoloNotificationEmail(boloToConfirm, 'new-bolo-notification');
              req.flash('success_msg', 'Bolo has been confirmed');
              res.redirect('/bolo');
            }
          });
        }
      }
    });
  } else {
    next();
  }
};

/**
 * Confirms an emailed Bolo
 */
exports.confirmBolo = function(req, res, next) {
  Bolo.findBoloByToken(req.params.token, function(err, boloToConfirm) {
    if (err)
      console.log(err);
    else {
      if (!boloToConfirm) {
        req.flash('error_msg', 'Bolo to confirm was not found on the database');
        res.redirect('/bolo');
      } else if (boloToConfirm.isConfirmed === true) {
        req.flash('error_msg', 'That Bolo was already confirmed');
        res.redirect('/bolo');
      } else if (boloToConfirm.boloToDelete != 'N/A') {
        //Find original BOLO
        Bolo.findBoloByID(boloToConfirm.boloToDelete, function(err, originalBolo) {
          if (err)
            console.log(err);
          else {
            if (!originalBolo) {
              //Delete new BOLO if original cannot be found
              Bolo.deleteBolo(boloToConfirm.id, function(err) {
                if (err)
                  console.log(err);
                else {
                  req.flash('error_msg', 'Bolo to confirm was not found on the database');
                  res.redirect('/bolo');
                }
              });
            } else {
              //Delete original BOLO
              Bolo.deleteBolo(boloToConfirm.boloToDelete, function(err) {
                if (err)
                  console.log(err);
                else {
                  boloToConfirm.boloToDelete = 'N/A';
                  boloToConfirm.isConfirmed = true;
                  boloToConfirm.save(function(err) {
                    if (err)
                      console.log(err);
                    else {
                      sendBoloNotificationEmail(boloToConfirm, 'update-bolo-notification');
                      req.flash('success_msg', 'Bolo has been confirmed');
                      res.redirect('/bolo');
                    }
                  });
                }
              });
            }
          }
        });
      } else {
        boloToConfirm.isConfirmed = true;
        boloToConfirm.save(function(err) {
          if (err)
            console.log(err);
          else {
            sendBoloNotificationEmail(boloToConfirm, 'new-bolo-notification');
            req.flash('success_msg', 'Bolo has been confirmed');
            res.redirect('/bolo');
          }
        });
      }
    }
  });
};

/**
 * Render the bolo edit form
 */
exports.getEditBolo = function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Bolo.findBoloByID(req.params.id, function(err, bolo) {
      if (err)
        console.log(err);
      else {
        if (req.user.tier === 'ROOT' || ((req.user.tier === 'ADMINISTRATOR' || req.user.tier === 'SUPERVISOR') && req.user.agency.id === bolo.agency.id) || (req.user.id === bolo.author.id)) {
          var d = new Date(bolo.reportedOn);

          var date = [
            d.getMonth() + 1,
            d.getDate(),
            d.getFullYear()
          ].join('/');
          var time = [
            d.getHours(),
            (d.getMinutes() < 10)
              ? d.getMinutes() + "0"
              : d.getMinutes()
          ].join(':');

          var prevForm = {
            dateReported: date,
            timeReported: time,
            internal: bolo.internal,
            vid: bolo.videoURL,
            info: bolo.info,
            summary: bolo.summary,
            fields: bolo.fields
          };
          res.render('bolo-edit', {
            bolo: bolo,
            prevForm: prevForm
          });

        } else {
          req.flash('error_msg', 'You can not edit this Bolo');
          res.redirect('/bolo');
        }
      }
    });
  } else {
    next();
  }
};

/**
 * Process edits on a specific bolo
 */
exports.postEditBolo = function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Bolo.findBoloByID(req.params.id, function(err, bolo) {
      if (err)
        console.log(err);
      else {
        if (req.user.tier === 'ROOT' || ((req.user.tier === 'ADMINISTRATOR' || req.user.tier === 'SUPERVISOR') && req.user.agency.id === bolo.agency.id) || (req.user.id === bolo.author.id)) {

          //Validation of form
          var errors = [];
          req.checkBody('category', 'Please select a category').notEmpty();
          req.checkBody('dateReported', 'Please enter a date').notEmpty();
          req.checkBody('timeReported', 'Please enter a time').notEmpty();

          var valErrors = req.validationErrors();
          for (var x in valErrors)
            errors.push(valErrors[x]);

          //Create a date object using date and time reported
          const reportedDate = req.body.dateReported.split('/');
          const reportedTime = req.body.timeReported.split(':');
          const newDate = new Date(reportedDate[2], reportedDate[0], reportedDate[1] - 1, reportedTime[0], reportedTime[1], 0, 0);

          //Format Summary
          var splitSummary =  req.body.summary.split(" ");
          var totalSummary = "";
          var wordInSummary = "";
          for (var i = 0; i < splitSummary.length; i++){
              for (var j = 0; j < splitSummary[i].length; j++){
                  wordInSummary = wordInSummary + splitSummary[i].charAt(j);
                  if (j % 37 == 0 && j != 0){
                    wordInSummary = wordInSummary + " ";
                  }
              }
              totalSummary = totalSummary + wordInSummary + " ";
              wordInSummary = "";
          }


          //Do the same for Additional info
          var splitInfo =  req.body.info.split(" ");
          var totalInfo = "";
          var wordInInfo = "";
          for (var i = 0; i < splitInfo.length; i++){
              for (var j = 0; j < splitInfo[i].length; j++){
                  wordInInfo = wordInInfo + splitInfo[i].charAt(j);
                  if (j % 37 == 0 && j != 0){
                    wordInInfo = wordInInfo + " ";
                  }
              }
              totalInfo = totalInfo + wordInInfo + " ";
              wordInInfo = "";
          }


          if (isNaN(newDate.getTime())) {
            errors.push('Please Enter a Valid Date');
          }

          var prevForm = {
            dateReported: req.body.dateReported,
            timeReported: req.body.timeReported,
            vid: req.body.videoURL,
            info: req.body.info,
            summary: req.body.summary,
            fields: req.body.field,
            internal: (req.body.internal)
              ? true
              : false
          };

          // If there are errors
          if (errors.length) {
            console.log("Validation errors:" + errors);

            //Render back page
            prevForm.errors = errors;
            res.render('bolo-edit', {
              bolo: bolo,
              prevForm: prevForm
            }//If no errors were found
            );

          } else {
            console.log("The current status is: " + bolo.status);
            console.log("The new status is: " + req.body.status);

            var token = crypto.randomBytes(20).toString('hex');
            var newBolo = new Bolo({
              author: bolo.author.id,
              agency: bolo.agency.id,
              internal: (req.body.internal)
                ? true
                : false,
              category: bolo.category.id,
              createdOn: bolo.createdOn,
              conformationToken: token,
              boloToDelete: bolo.id,
              isConfirmed: false,
              lastUpdated: Date.now(),
              subscribers: bolo.subscribers,
              reportedOn: newDate,
              videoURL: req.body.videoURL,
              info: totalInfo,
              summary: totalSummary,
              status: req.body.status,
              fields: req.body.field
            });

            //Fill in missing fields
            if (!newBolo.videoURL)
              newBolo.videoURL = "";
            if (!newBolo.info)
              newBolo.info = "";
            if (!newBolo.summary)
              newBolo.summary = "";

            console.log('req.body.field: ' + req.body.field);
            newBolo.fields = req.body.field;
            for (var i in newBolo.fields) {
              if (newBolo.fields[i] === '') {
                newBolo.fields[i] = 'N/A';
              }
            }

            if (req.files['featured']) {
              newBolo.featured = {
                data: req.files['featured'][0].buffer,
                contentType: req.files['featured'][0].mimeType
              };
            } else {
              newBolo.featured = bolo.featured;
            }

            if (req.files['other1']) {
              newBolo.other1 = {
                data: req.files['other1'][0].buffer,
                contentType: req.files['other1'][0].mimeType
              };
            } else {
              newBolo.other1 = bolo.other1;
            }

            if (req.files['other2']) {
              newBolo.other2 = {
                data: req.files['other2'][0].buffer,
                contentType: req.files['other2'][0].mimeType
              };
            } else {
              newBolo.other2 = bolo.other2;
            }

            newBolo.save(function(err) {
              if (err) {
                console.log('Bolo could not be updated...');
                console.log(getErrorMessage(err)[0].msg);
                req.flash('error_msg', getErrorMessage(err)[0].msg);
                res.redirect('/bolo/edit/' + req.params.id);
              } else {
                console.log('Sending email using Sendgrid');
                sendBoloUpdateConfirmationEmail(req.user.email, req.user.firstname, req.user.lastname, token);
                req.flash('success_msg', 'BOLO successfully updated, Please check your email in order to confirm it.');
                res.redirect('/bolo');
              }
            });
          }
        } else {
          req.flash('error_msg', 'You can not edit this Bolo');
          res.redirect('/bolo');
        }
      }
    })
  } else {
    next();
  }
};

function dateDiffInYears(a, b) {
  var _MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;

  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_YEAR);
}

/**
 * List archived bolos
 */
exports.renderArchivedBolos = function(req, res, next) {
  const tier = req.user.tier;
  const isRoot = tier === 'ROOT';
  Bolo.findOldestArchivedBolos(tier, req, 1, 'reportedOn', function(err, bolo) {
    if (err)
      console.log(err);
    else if (bolo.length) {
      var today = new Date();
      var d = new Date(bolo[0].reportedOn);
      var oldestYear = dateDiffInYears(d, today);
      var labels = [];
      labels.push({name: "All Archived Bolos", id: 'default'});
      var i;
      for (i = 1; i <= oldestYear; i++) {
        labels.push({
          name: converter.toWords(i).charAt(0).toUpperCase() + converter.toWords(i).slice(1) + " Year" + ((i > 1)
            ? 's'
            : ''),
          id: i
        });
      }

      res.render('bolo-archive', { labels, isRoot });
    } else
      res.render('bolo-archive', { isRoot });
    }
  );
};

/**
 * Handle requests to inactivate a specific bolo
 */
exports.archiveBolo = function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Bolo.findBoloByID(req.params.id, function(err, bolo) {
      if (err)
        console.log(err);
      else {
        bolo.isArchived = true;
        var shortID = bolo.id.substring(0, 8) + '...';
        bolo.save(function(err) {
          if (err)
            console.log(err);
          else {
            req.flash('error_msg', 'Bolo ' + shortID + ' has been archived');
            res.redirect('/bolo');
          }
        });
      }
    });
  } else {
    next();
  }
};

/**
 * Handle requests to activate a specific bolo
 */
exports.unArchiveBolo = function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Bolo.findBoloByID(req.params.id, function(err, bolo) {
      if (err)
        console.log(err);
      else {
        bolo.isArchived = false;
        var shortID = bolo.id.substring(0, 8) + '...';
        bolo.save(function(err) {
          if (err)
            console.log(err);
          else {
            req.flash('success_msg', 'Bolo ' + shortID + ' has been restored');
            res.redirect('/bolo/archive');
          }
        });
      }
    });
  } else {
    next();
  }
};

/**
 * Deletes a specific bolo
 */
exports.deleteBolo = function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    var shortID = req.params.id.substring(0, 8) + '...';
    Bolo.findBoloByID(req.params.id, function(err, bolo) {
      if (err)
        console.log(err);
      else {
        //Check if the current user is authorized to delete the bolo
        if (req.user.tier === 'ROOT' || (req.user.tier === 'ADMINISTRATOR' && req.user.agency.id === bolo.agency.id)) {
          Bolo.deleteBolo(req.params.id, function(err) {
            if (err)
              console.log(err);
            else {
              req.flash('success_msg', 'BOLO ' + shortID + ' has been deleted');
              res.redirect('/bolo/archive');
            }
          });
        } else {
          req.flash('error_msg', 'You are not authorized to delete BOLO ' + shortID);
          res.redirect('/bolo/archive');
        }
      }
    })
  } else {
    next();
  }
};

/**
 * Gets the bolo purge archive view
 */
exports.renderPurgeArchivedBolosPage = function(req, res) {
  const tier = req.user.tier;
  if (req.body.range == 'default' || req.params.id == 'default') {
    Bolo.findArchivedBolos(tier, req, 'reportedOn', function(err, listOfBolos) {
      if (err)
        console.log(err);
      else {
        var warning_msg = 'This will delete all of the archived bolos';
        res.render('bolo-archive-purge', {
          bolos: listOfBolos,
          id: 'default',
          msg: warning_msg
        });
      }
    });
  } else {
    var today = new Date();
    var minusYear = (req.body.range)
      ? req.body.range
      : req.params.id;
    var newDate = new Date((today.getFullYear() - parseInt(minusYear)), today.getMonth(), today.getDate());
    console.log(newDate);

    Bolo.findBolosLessThan(tier, req, newDate, 'reportedOn', function(err, listOfBolos) {
      if (err)
        console.log(err);
      else {
        var warning_msg = 'This will delete the archived bolos older than ' + converter.toWords(minusYear) + ' year' + ((minusYear > 1)
          ? 's'
          : '');
        res.render('bolo-archive-purge', {
          bolos: listOfBolos,
          id: minusYear,
          msg: warning_msg
        });
      }
    });
  }

};

/**
 * Deletes all archived bolos
 */
exports.purgeArchivedBolos = function(req, res, next) {
  const tier = req.user.tier;
  //Check if the current user is authorized to delete all archived bolos
  if (req.user.tier === 'ROOT') {
    User.comparePassword(req.body.password, req.user.password, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Result: " + result);
        if (result) {
          if (req.params.id == 'default') {
            Bolo.deleteAllArchivedBolos(tier, req, function(err, result) {
              if (err)
                console.log(err);
              else {
                console.log(result);
                req.flash('success_msg', 'All archived BOLOs have been deleted. Removed ' + result.result.n + ' BOLOs');
                res.redirect('/bolo/archive');
              }
            });
          } else {

            var today = new Date();
            var minusYear = req.params.id;
            var newDate = new Date((today.getFullYear() - parseInt(minusYear)), today.getMonth(), today.getDate());
            console.log(newDate);

            Bolo.deleteBolosLessThan(tier, req, newDate, function(err, result) {
              if (err)
                console.log(err);
              else {
                console.log(result);
                req.flash('success_msg', 'All BOLOs older than ' + converter.toWords(minusYear) + ' year' + ((minusYear > 1)
                  ? 's have'
                  : ' has') + ' been deleted. Removed ' + result.result.n + ' BOLOs');
                res.redirect('/bolo/archive');
              }
            });
          }

        } else {
          req.flash('error_msg', 'Password was not correct');
          res.redirect('/bolo/archive/purge/' + req.params.id);
        }
      }
    })
  } else {
    req.flash('error_msg', 'You are not authorized to purge BOLOs');
    res.redirect('/bolo/archive');
  }
};

/**
 * Searches though all bolos where the user has access
 */
exports.getBoloSearch = function(req, res, next) {
  Agency.findAllAgencies(function(err, listOfAgencies) {
    if (err)
      console.log(err);
    else {
      var listOfAgencyNames = [];
      listOfAgencyNames.push('All Agencies');
      for (const i in listOfAgencies) {
        listOfAgencyNames.push(listOfAgencies[i].name);
        console.log(listOfAgencies[i].name + "  ");
      }
      Category.findAllCategories(function(err, listOfCategories) {
        if (err)
          console.log(err);
        else {
          res.render('bolo-search', {
            agencies: listOfAgencyNames,
            categories: listOfCategories
          });
        }
      });
    }
  })
};

/**
 * Searches though all bolos based on the req.body input
 */
exports.postBoloSearch = function(req, res, next) {
  console.log('in postBoloSearch function inside bolo controller');
  const selectedAgency = req.body.agencyName;
  const selectedCategory = req.body.categoryName;
  const agencyWasSelected = selectedAgency !== 'All Agencies';
  const categoryWasSelected = selectedCategory !== 'Select a Category';
  const searchTerm = req.body.searchTerm;

  const options = {
    searchTerm,
    req,
    currentUserAgency: req.user.agency.id,
    tier: req.user.tier,
  };

  Bolo.wildcardSearch(options, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      let filteredResults = [];
      if (agencyWasSelected && categoryWasSelected) {
        filteredResults = results.filter((retrievedBolo) => {
          return (retrievedBolo.agency.name === selectedAgency) &&
            (retrievedBolo.category.name === selectedCategory);
        });
      } else if (agencyWasSelected && !categoryWasSelected) {
        filteredResults = results.filter((retrievedBolo) => {
          return (retrievedBolo.agency.name === selectedAgency);
        });
      } else if (!agencyWasSelected && categoryWasSelected) {
        filteredResults = results.filter((retrievedBolo) => {
          return (retrievedBolo.category.name === selectedCategory);
        });
      } else {
        filteredResults = results;
      }

      res.render('bolo-search-results', {
        searchTerm: req.body.searchTerm,
        bolos: filteredResults,
      });
    }
  });
};
