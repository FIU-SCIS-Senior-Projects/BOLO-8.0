var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Need a name'],
        unique: [true, 'User Already Exists'],
        trim: true
    },
    emailDomain: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: [true, 'Need a city']
    },
    state: {
        type: String,
        required: [true, 'Need a state']
    },
    zipcode: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    logo: {
        data: Buffer,
        contentType: String
    },
    shield: {
        data: Buffer,
        contentType: String
    },
    watermark: {
        data: Buffer,
        contentType: String
    }
});

var Agency = module.exports = mongoose.model('agency', Schema);

/**
 * Returns a list of all agencies on the database except the null agency for the root user
 * @param callback a function where the first parameter is an error if any, and the second
 * parameter is the list of all agencies
 */
module.exports.findAllAgencies = function (callback) {
    Agency.find({name: {$ne: 'NULL'}}, callback);
};

module.exports.findAllActiveAgencies = function (callback) {
    Agency.find({name: {$ne: 'NULL'}, isActive: true}, callback);
};

/**
 * Returns an agency on the database
 * @param agencyName the name of the agency
 * @param callback a function where the first parameter is an error if any, and the second
 * parameter is the agency
 */
module.exports.findAgencyByName = function (agencyName, callback) {
    Agency.findOne({name: agencyName}, callback);
};

module.exports.removeLogo = function (id, callback) {
    Agency.findOneAndUpdate({_id: id}, {
        logo: {}
    }, callback);
};

module.exports.removeShield = function (id, callback) {
    Agency.findOneAndUpdate({_id: id}, {
        shield: {}
    }, callback);
};

module.exports.removeWatermark = function (id, callback) {
    Agency.findOneAndUpdate({_id: id}, {
        watermark: {}
    }, callback);
};

module.exports.findAgencyByID = function (id, callback) {
    Agency.findById(id, callback);
};

module.exports.findAgenciesByID = function (ids, callback) {
    Agency.find({_id : { $in: ids }}, callback);
};

module.exports.findUnsubscribedAgenciesByID = function (ids, callback) {
    if(ids.length > 0)
        Agency.find({_id: { $nin: ids}, name: {$ne: 'NULL'}}, callback);
    else
        Agency.find({name: {$ne: 'NULL'}}, callback);
};
 
module.exports.findAgencyByIDAndUpdate = function (id, newData, callback) {
    Agency.findOneAndUpdate({_id: id}, {$set: {newData}}, {new: false}, callback);
};

module.exports.removeAgencyByID = function (agencyID, callback) {
    Agency.remove({_id: agencyID}).exec(callback);
};

