var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agency',
        required: true
    },
    internal: {
        type: Boolean, 
        default: false,
        required: true
    },
    reportedOn: {
        type: Date,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    fields: {
        type: [String]
    },
    videoURL: {
        type: String
    },
    info: {
        type: String
    },
    summary: {
        type: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'FOUND', 'ARRESTED', 'RESOLVED'],
        required: true
    },
    featured: {
        data: Buffer,
        contentType: String
    },
    other1: {
        data: Buffer,
        contentType: String
    },
    other2: {
        data: Buffer,
        contentType: String
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    conformationToken: {
        type: String,
        required: true
    },
    boloToDelete: {
        type: String,
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    subscribers: {
        type: [String]
    }
});

var Bolo = module.exports = mongoose.model('bolo', Schema);

module.exports.findBoloByID = function (id, callback) {
    Bolo.findOne({_id: id}).populate('agency').populate('author').populate('category').exec(callback);
};

module.exports.findAllBolos = function (req, isConfirmed, isArchived, limit, sortBy, callback) {
    Bolo.find({ isConfirmed: isConfirmed, isArchived: isArchived, $or: [ {internal: false}, {internal: null}, {$and: [{internal: true}, {agency: req.user.agency.id}]} ] })
        .populate('agency').populate('author').populate('category')
        .limit(limit)
        .sort([[sortBy, -1]])
        .exec(callback);
};

module.exports.findOldestArchivedBolos = function (req, limit, sortBy, callback) {
    Bolo.find({ isConfirmed: true, isArchived: true, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .populate('agency').populate('author').populate('category')
        .limit(limit)
        .sort([[sortBy, 1]])
        .exec(callback);
};

module.exports.findBolosLessThan = function (req, lessThanDate, sortBy, callback) {
    Bolo.find({ isConfirmed: true, isArchived: true, 'reportedOn': { $lte : lessThanDate }, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .populate('agency').populate('author').populate('category')
        .sort([[sortBy, -1]])
        .exec(callback);
};

module.exports.findArchivedBolos = function (req, sortBy, callback) {
    Bolo.find({ isConfirmed: true, isArchived: true, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .populate('agency').populate('author').populate('category')
        .sort([[sortBy, -1]])
        .exec(callback);
};

module.exports.findBolosByAuthor = function (authorID, isConfirmed, isArchived, limit, sortBy, callback) {
    Bolo.find({author: authorID, isConfirmed: isConfirmed, isArchived: isArchived})
        .populate('agency').populate('author').populate('category')
        .limit(limit)
        .sort([[sortBy, -1]])
        .exec(callback);
};
module.exports.findBolosByAgencyID = function (req, agencyID, isConfirmed, isArchived, limit, sortBy, callback) {
    Bolo.find({ agency: agencyID, isConfirmed: isConfirmed, isArchived: isArchived, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .populate('agency').populate('author').populate('category')
        .limit(limit)
        .sort([[sortBy, -1]])
        .exec(callback);
};

module.exports.findBolosByInternal = function (req, isConfirmed, isArchived, limit, sortBy, callback) {
    Bolo.find({ isConfirmed: isConfirmed, isArchived: isArchived, $and: [{ internal: true }, { agency: req.user.agency.id }] })
        .populate('agency').populate('author').populate('category')
        .limit(limit)
        .sort([[sortBy, -1]])
        .exec(callback);
};

module.exports.findAllBolosByAgencyID = function (req, agencyID, callback){
    Bolo.find({ agency: agencyID, isConfirmed: true, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .exec(callback);
};

module.exports.findBoloByCategoryID = function (id, callback){
    Bolo.findOne({category: id})
        .exec(callback);
};

module.exports.findIfEmailIsInBolo = function (boloID, email, callback) {
    Bolo.find({_id: boloID, subscribers: email})
        .exec(callback);
};

module.exports.subscribeToBOLO = function (boloId, email, callback) {
    Bolo.findByIdAndUpdate(boloId,
        {$addToSet: {subscribers: email}},
        {safe: true, upsert: true},
        callback);
};

module.exports.unsubscribeFromBOLO = function (boloId, email, callback) {
    Bolo.findByIdAndUpdate(boloId,
        {$pullAll: {subscribers: [email]}},
        callback);
};


module.exports.findBolosByAgencyIDs = function (req, agencyIDs, isConfirmed, isArchived, limit, sortBy, callback) {
    Bolo.find({ agency: { $in: agencyIDs }, isConfirmed: isConfirmed, isArchived: isArchived, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .populate('agency').populate('author').populate('category')
        .limit(limit)
        .sort([[sortBy, -1]])
        .exec(callback);
};

module.exports.findBoloByToken = function (token, callback) {
    Bolo.findOne({conformationToken: token}).exec(callback);
};

module.exports.addDataSubscriberEmailToBolo = function (boloID, emailToAdd, callback) {
    Bolo.findByIdAndUpdate(boloID, {$push: {subscribers: emailToAdd}}, {safe: true, upsert: true}, callback);
};

module.exports.searchAllBolosByAgencyAndCategory = function (req, agencyID, categoryID, fieldsArray, callback) {
    console.log('Searching for AgencyID: ' + agencyID + ', categoryID: ' + categoryID + ', fieldsArray: ' + fieldsArray);
    if (!Array.isArray(fieldsArray))
        fieldsArray = [fieldsArray];
        
    var isFieldsArrayEmpty = 0;    
    for (var item = 0; item < fieldsArray.length; item++){
        if(fieldsArray[item] !== '')
            isFieldsArrayEmpty++;
    }    

    if(!categoryID)
        Bolo.find({ agency: agencyID, isConfirmed: true, isArchived: false, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
            .populate('agency').populate('author').populate('category')
            .sort([['createdOn', -1]])
            .exec(callback);
    else if(!isFieldsArrayEmpty)
        Bolo.find({ agency: agencyID, category: categoryID, isConfirmed: true, isArchived: false, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
            .populate('agency').populate('author').populate('category')
            .sort([['createdOn', -1]])
            .exec(callback);
    else
        Bolo.find({ agency: agencyID, category: categoryID, fields: { $in: fieldsArray }, isConfirmed: true, isArchived: false, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
            .populate('agency').populate('author').populate('category')
            .sort([['createdOn', -1]])
            .exec(callback);
};

module.exports.searchAllBolosByCategory = function (req, categoryID, fieldsArray, callback) {
    console.log('Searching for categoryID: ' + categoryID + ', fieldsArray: ' + fieldsArray);
    if (!Array.isArray(fieldsArray))
        fieldsArray = [fieldsArray];   

    var isFieldsArrayEmpty = 0;    
    for (var item = 0; item < fieldsArray.length; item++){
        if(fieldsArray[item] !== '')
            isFieldsArrayEmpty++;  
    }

    if(!categoryID)
        Bolo.find({ isConfirmed: true, isArchived: false, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
            .populate('agency').populate('author').populate('category')
            .sort([['createdOn', -1]])
            .exec(callback);
    else if (!isFieldsArrayEmpty)
        Bolo.find({ category: categoryID, isConfirmed: true, isArchived: false, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
            .populate('agency').populate('author').populate('category')
            .sort([['createdOn', -1]])
            .exec(callback);
    else
        Bolo.find({ category: categoryID, fields: { $in: fieldsArray }, isConfirmed: true, isArchived: false, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
            .populate('agency').populate('author').populate('category')
            .sort([['createdOn', -1]])
            .exec(callback);
};

module.exports.deleteBolo = function (id, callback) {
    Bolo.remove({_id: id}).exec(callback);
};

module.exports.removeAuthorFromBolos = function (authorID, nullID, callback) {
    Bolo.update({author: authorID}, {author: nullID}, {multi: true}, callback);
};

module.exports.deleteAllArchivedBolos = function (req, callback) {
    Bolo.remove({ isArchived: true, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .exec(callback);
};

module.exports.deleteBolosLessThan = function (req, lessThanDate, callback) {
    Bolo.remove({ isArchived: true, 'reportedOn': { $lte: lessThanDate }, $or: [{ internal: false }, { internal: null }, { $and: [{ internal: true }, { agency: req.user.agency.id }] }] })
        .exec(callback);
};
