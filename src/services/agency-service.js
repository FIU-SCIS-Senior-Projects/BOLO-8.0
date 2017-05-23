/* jshint node: true */
'use strict';
var _ = require('lodash');

var Agency = require('../domain/agency.js');
var Promise = require('promise');

/** @module core/ports */
module.exports = AgencyService;


/**
 * Creates a new instance of {AgencyService}.
 *
 * @class
 * @classdesc Provides an API for client adapters to interact with user facing
 * functionality.
 *
 * @param {AgencyRepository}
 */
function AgencyService ( AgencyRepository ) {
    this.AgencyRepository = AgencyRepository;
}


/**
 * Create a new Agency in the system.
 *
 * @param {object} agencyData - Data for the new Agency
 * @param {object} attachments - Agency Attachments
 */
AgencyService.prototype.createAgency = function ( agencyData, attachments) {
    var agency = new Agency(agencyData);
    var validatename = 0;
    var context = this;
    if (!agency.isValid()) {
        //TODO: promise should be returned but it is awaiting correct implemenation of isValid() function
        // return Promise.reject(new Error("ERROR: Invalid agency data."));
        Promise.reject(new Error("ERROR: Invalid agency data."));
    }

    return context.findAgencyById(agency.agency_id, agency.name).then(function (results) {
        if (results > 0) {
            return Promise.reject(new Error("ERROR: Agency ID already registered"));
        }
        else {
            return context.AgencyRepository.getAgencies().then(function (agencies){

                agencies.forEach(function(currentagency) {
                    if(currentagency.data.name === agency.data.name ){
                        validatename++;
                    }
                });

                if(validatename<1){

                    return context.AgencyRepository.insert(agency, attachments)
                    .then(function (value) {
                            return value;
                        })
                        .catch(function (error) {
                            throw new Error('Unable to create Agency.');
                        });
                }
                else{
                    return Promise.reject(new Error("ERROR: Agency Name already registered"));
                }
            });

        }
    });

};


/**
 * Create a new Agency in the system.
 *
 * @param {object} agencyData - Agency to update
 * @param {object} attachments - Agency Attachments
 */
AgencyService.prototype.updateAgency = function ( agencyData, attachments ) {
    var context = this;
    var updated = new Agency( agencyData);
    var validatename = 0;

    if ( ! updated.isValid() ) {
        throw new Error( "Invalid agency data" );
    }

     return context.AgencyRepository.getAgencies().then(function (agencies){

                agencies.forEach(function(currentagency) {
                    if(currentagency.data.name === updated.name ){
                        validatename++;
                        if(currentagency.data.id === updated.id){
                            validatename--;
                        }
                    }
                });

                if(validatename<1){

                    return context.AgencyRepository.getAgency( updated.data.id )
                    .then( function ( original ) {

                        var atts = _.assign( {}, original.data.attachments );
                        original.diff( updated ).forEach( function ( key ) {
                            original.data[key] = updated.data[key];
                        });

                        original.data.attachments = atts;
                        return context.AgencyRepository.update( original, attachments );
                    })
                    .then( function ( updated ) {
                        return updated;
                    })
                    .catch( function ( error ) {
                        console.log(error);
                        return Promise.reject( new Error("Agency does not exist.") );
                    });
                }
                else{
                    return Promise.reject(new Error("Agency Name already registered"));
                }
        });
};

/**
 * Retrieve a collection of agencies
 */
AgencyService.prototype.getAgencies = function ( ids ) {
    return this.AgencyRepository.getAgencies( ids );
};

AgencyService.prototype.getAgency = function ( id ) {
    var context = this;
    return context.AgencyRepository.getAgency( id );
};

AgencyService.prototype.searchAgencies = function(query_string){

    var result = this.AgencyRepository.searchAgencies(query_string);
    return result;

};

AgencyService.prototype.findAgencyById = function(id){

    var result = this.AgencyRepository.findAgencyById(id);
    return result;

};

/**
 * Get an attachment for a specified Agency.
 */
AgencyService.prototype.getAttachment = function ( id, attname ) {
    var context = this;
    return context.AgencyRepository.getAttachment( id, attname );
};

AgencyService.formatDTO = formatDTO;
AgencyService.prototype.formatDTO = formatDTO;
function formatDTO ( dto ) {
    var newdto = new Agency().data;

    Object.keys( newdto ).forEach( function ( key ) {
        newdto[key] = dto[key] || newdto[key];
    });

    return newdto;
}
