var multiparty = require('multiparty');
var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');
var Agency = require('../../models/agency');
var BOLO = require('../../models/bolo');
var config = require('../../config');

var all_fields = ['BOLOid', 'Status', 'Agency', 'Author', 'Category'];

var secondary_fields = ['Info', 'Video URL', 'Summary', 'FeaturedImage',
    'Other1Image', 'Other2Image', 'CreatedOn', 'LastUpdatedOn'];

/**
 * Respond with a form to create a Data Subscriber.
 */

module.exports.getDataAnalysis = function (req, res, next) {
    Agency.findAllAgencies(function (err, listOfAgencies) {
        if (err) next(err);
        res.render('admin-data-analysis', {agencies: listOfAgencies});
    });
};

module.exports.downloadCsv = function (req, res, next) {
    var agenciesToFilterBy = req.body.agencies;
    const limit = 2000000;
    const isArchived = false;

    BOLO.findBolosByAgencyIDs(req, agenciesToFilterBy, true, isArchived, limit, 'createdOn', function (err, listOfBOLOS) {
        if (err) next(err);
        var formattedListOfBOLOS = [];
        for (var i = 0; i < listOfBOLOS.length; i++) {
            var featured = "No";
            var other1 = "No";
            var other2 = "No";
            if (listOfBOLOS[i].featured.data !== undefined) {
                featured = "Yes";
            }
            if (listOfBOLOS[i].other1.data !== undefined) {
                other1 = "Yes";
            }
            if (listOfBOLOS[i].other2.data !== undefined) {
                other2 = "Yes";
            }
            var newJSON = {
                BOLOid: listOfBOLOS[i].id,
                Status: listOfBOLOS[i].status,
                Agency: listOfBOLOS[i].agency.name,
                Author: listOfBOLOS[i].author.firstname + " " + listOfBOLOS[i].author.lastname,
                Category: listOfBOLOS[i].category.name
            };

            for (var j = 0; j < listOfBOLOS[i].fields.length; j++) {
                if (all_fields.indexOf(listOfBOLOS[i].category.fields[j]) === -1) {
                    all_fields.push(listOfBOLOS[i].category.fields[j]);
                }
                newJSON[listOfBOLOS[i].category.fields[j]] = listOfBOLOS[i].fields[j];
            }
            newJSON.Info = listOfBOLOS[i].info;
            newJSON.VideoURL = listOfBOLOS[i].videoURL;
            newJSON.Summary = listOfBOLOS[i].summary;
            newJSON.FeaturedImage = featured;
            newJSON.Other1Image = other1;
            newJSON.Other2Image = other2;
            newJSON.CreatedOn = listOfBOLOS[i].createdOn;
            newJSON.LastUpdatedOn = listOfBOLOS[i].lastUpdated;

            formattedListOfBOLOS[i] = newJSON;
        }

        for (var k = 0; k < secondary_fields.length; k++) {
            if (all_fields.indexOf(secondary_fields[k]) === -1) {
                all_fields.push(secondary_fields[k]);
            }
        }

        json2csv({data: formattedListOfBOLOS, fields: all_fields}, function (err, csv) {
            if (err) {
                next(err);
            }
            else {
                res.set({
                    'Content-Disposition': 'attachment; filename=DataAnalysis.csv',
                    'Content-Type': 'text/csv'
                });
                res.send(csv);
            }
        });
    });
};
