var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    OFFICER: {
        type: Boolean,
        default: false,
        required: true
    },
    SUPERVISOR: {
        type: Boolean,
        default: false,
        required: true
    },
    ADMINISTRATOR: {
        type: Boolean,
        default: false,
        required: true
    },
    ROOT: {
        type: Boolean,
        default: false,
        required: true
    }
});

var UserGuide = module.exports = mongoose.model('userguide', Schema);


module.exports.findSectionByID = function (id, callback) {
    UserGuide.findById(id, callback);
};

module.exports.removeUserGuideSection = function (id, callback) {
    UserGuide.remove({ _id: id }).exec(callback);
};

module.exports.findAllSections = function (callback) {
    UserGuide.find({})
        .sort([['title', 1]])
        .exec(callback);
};

module.exports.findRootUserGuideSections = function (callback) {
    UserGuide.find({ ROOT: true })
        .sort([['title', 1]])
        .exec(callback);
};

module.exports.findOfficerUserGuideSections = function (callback) {
    UserGuide.find({ OFFICER: true })
        .sort([['title', 1]])
        .exec(callback);
};

module.exports.findSupervisorUserGuideSections = function (callback) {
    UserGuide.find({ SUPERVISOR: true })
        .sort([['title', 1]])
        .exec(callback);
};

module.exports.findAdministratorUserGuideSections = function (callback) {
    UserGuide.find({ ADMINISTRATOR: true })
        .sort([['title', 1]])
        .exec(callback);
};