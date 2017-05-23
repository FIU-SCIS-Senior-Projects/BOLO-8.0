/* jshint node: true */
'use strict';
var _ = require('lodash');

var DataSubscriber = require('../domain/dataSubscriber.js');//pending
var Promise = require('promise');

/** @module core/ports */
module.exports = dataSubscriberService;


/**
 * Creates a new instance of {AgencyService}.
 *
 * @class
 * @classdesc Provides an API for client adapters to interact with user facing
 * functionality.
 *
 * @param {AgencyRepository}
 */
function dataSubscriberService ( dataSubscriberRepository ) {
    this.dataSubscriberRepository = dataSubscriberRepository;
}


/**
 * Create a new Agency in the system.
 *
 * @param {object} agencyData - Data for the new Agency
 * @param {object} attachments - Agency Attachments
 */
dataSubscriberService.prototype.createDataSubscriber = function ( dataSubscriberData) {
    var dataSubscriber = new DataSubscriber(dataSubscriberData);
    var validatename = 0;
    var context = this;
    if (!dataSubscriber.isValid()) {
        //TODO: promise should be returned but it is awaiting correct implemenation of isValid() function
        // return Promise.reject(new Error("ERROR: Invalid agency data."));
        Promise.reject(new Error("ERROR: Invalid subscriber data."));
    }

    return context.findDataSubscriberById(dataSubscriber.dataSubscriber_id, dataSubscriber.name).then(function (results) {
        if (results > 0) {
            return Promise.reject(new Error("ERROR: Subscriber ID already registered"));
        }
        else {
            return context.dataSubscriberRepository.getDataSubscribers('by_dataSubscriber').then(function (dataSubscribers){

                dataSubscribers.forEach(function(currentDataSubscriber) {
                    if(currentDataSubscriber.data.name === dataSubscriber.data.name ){
                        validatename++;
                    }
                });

                if(validatename<1){

                    return context.dataSubscriberRepository.insert(dataSubscriber)
                    .then(function (value) {
                            return value;
                        })
                        .catch(function (error) {
                            throw new Error('Unable to create Subscriber.');
                        });
                }
                else{
                    return Promise.reject(new Error("ERROR: Subscribers already registered"));
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
dataSubscriberService.prototype.updateDataSubscriber = function ( dataSubscriberData) {
    var context = this;
    var updated = new DataSubscriber( dataSubscriberData);
    var validatename = 0;

    if ( ! updated.isValid() ) {
        throw new Error( "Invalid subscriber data" );
    }

     return context.dataSubscriberRepository.getDataSubscribers('by_dataSubscriber').then(function (dataSubscribers){

                dataSubscribers.forEach(function(currentDataSubscriber) {
                    if(currentDataSubscriber.data.name === updated.name ){
                        validatename++;
                        if(currentDataSubscriber.data.id === updated.id){
                            validatename--;
                        }
                    }
                });

                if(validatename<1){

                    return context.dataSubscriberRepository.getDataSubscriber( updated.data.id )
                    .then( function ( original ) {


                        original.diff( updated ).forEach( function ( key ) {
                            original.data[key] = updated.data[key];
                        });


                        return context.dataSubscriberRepository.update( original);
                    })
                    .then( function ( updated ) {
                        return updated;
                    })
                    .catch( function ( error ) {
                        return Promise.reject( new Error("Subscriber does not exist.") );
                    });
                }
                else{
                    return Promise.reject(new Error("Subscriber already registered"));
                }
        });
};

/**
 * Retrieve a collection of agencies
 */
dataSubscriberService.prototype.getDataSubscribers = function ( ids ) {
    return this.dataSubscriberRepository.getDataSubscribers( ids );
};

dataSubscriberService.prototype.getDataSubscriber = function ( id ) {
    var context = this;
    return context.dataSubscriberRepository.getDataSubscriber( id );
};

dataSubscriberService.prototype.searchDataSubscribers = function(query_string){

    var result = this.dataSubscriberRepository.searchDataSubscribers(query_string);
    return result;


};

dataSubscriberService.prototype.getAllDataSubscribers = function (sortBy) {
    return this.dataSubscriberRepository.getAll(sortBy);
};

dataSubscriberService.prototype.findDataSubscriberById = function(id){

    var result = this.dataSubscriberRepository.findDataSubscriberById(id);
    return result;

};

/**
 * Get an attachment for a specified Agency.
 */

dataSubscriberService.formatDTO = formatDTO;
dataSubscriberService.prototype.formatDTO = formatDTO;
function formatDTO ( dto ) {
    var newdto = new DataSubscriber().data;

    Object.keys( newdto ).forEach( function ( key ) {
        newdto[key] = dto[key] || newdto[key];
    });

    return newdto;
}
