/* jshint node: true */
'use strict';
var _ = require('lodash');

var SystemSettings = require('../domain/systemSettings.js'); //pending
var Promise = require('promise');

/** @module core/ports */
module.exports = systemSettingsService;

/**
 * Creates a new instance of {SystemSettingsService}.
 *
 * @class
 * @classdesc Provides an API for client adapters to interact with user facing
 * functionality.
 *
 * @param {AgencyRepository}
 */
function systemSettingsService(systemSettingsRepository) {
  this.systemSettingsRepository = systemSettingsRepository;
}

/**
 * Create a new Agency in the system.
 *
 * @param {object} agencyData - Data for the new Agency
 * @param {object} attachments - Agency Attachments
 */
systemSettingsService.prototype.createsystemSettings = function(systemSettingsData) {
  var systemSettings = new SystemSettings(systemSettingsData);
  var validatename = 0;
  var context = this;
  if (!systemSettings.isValid()) {
    //TODO: promise should be returned but it is awaiting correct implemenation of isValid() function
    // return Promise.reject(new Error("ERROR: Invalid agency data."));
    Promise.reject(new Error("ERROR: Invalid System Settings data."));
  }
  return context.systemSettingsRepository.insert(systemSettings).then(function(value) {
    return value;
  }).catch(function(error) {
    console.log(error);
    throw new Error('Unable to create System Settings Document.');
  });

};

systemSettingsService.prototype.updatesystemSettings = function(systemSettingsData) {
  var systemSettings = new SystemSettings(systemSettingsData);
  var validatename = 0;
  var context = this;
  if (!systemSettings.isValid()) {
    //TODO: promise should be returned but it is awaiting correct implemenation of isValid() function
    // return Promise.reject(new Error("ERROR: Invalid agency data."));
    Promise.reject(new Error("ERROR: Invalid System Settings data."));
  }
  return context.systemSettingsRepository.update(systemSettings).then(function(value) {
    return value;
  }).catch(function(error) {
    console.log(error);
    throw new Error('Unable to create System Settings Document.');
  });

};

/**
 * Retrieve a collection of agencies
 */
systemSettingsService.prototype.getsystemSettings = function() {
  return this.systemSettingsRepository.getsystemSettings();
};

systemSettingsService.prototype.getSessionMinutes = function() {
  return this.getsystemSettings().then(function(systemSettings) {
    console.log(systemSettings.rows[0].doc.sessionMinutes);
    return systemSettings.rows[0].doc.sessionMinutes;
  }).catch(function(err) {
    throw err;
  })

};

systemSettingsService.prototype.getLoginAttempts = function() {
  return this.getsystemSettings().then(function(systemSettings) {
    console.log(systemSettings.rows[0].doc.loginAttempts);
    return systemSettings.rows[0].doc.loginAttempts;
  }).catch(function(err) {
    throw err;
  })

};

/**
 * Get an attachment for a specified Agency.
 */

systemSettingsService.formatDTO = formatDTO;
systemSettingsService.prototype.formatDTO = formatDTO;
function formatDTO(dto) {
  var newdto = new SystemSettings().data;

  Object.keys(newdto).forEach(function(key) {
    newdto[key] = dto[key] || newdto[key];
  });
  return newdto;
}
