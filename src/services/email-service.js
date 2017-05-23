/* jshint node: true */
'use strict';

var Promise = require('promise');

/*
 * Assume this works
 */
if (!process.env.SENDGRID_API_KEY) {
    throw new Error(
        'SendGrid API key not found: SENDGRID_API_KEY should be set.'
    );
}
// reaches here if API Key is found
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY);
exports.send = function (payload) {
    var email = new sendgrid.Email(payload);
    return new Promise(function (resolve, reject) {
        sendgrid.send(payload, function (err, json) {
            if (err) reject(err);
            else resolve(json);
        });
    });
};


