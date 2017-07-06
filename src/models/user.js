var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = new mongoose.Schema({
  username: {
    type: String,
    required: [
      true, 'Need a Username'
    ],
    unique: [
      true, 'Username already exists'
    ],
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: Date.now
  },
  tier: {
    type: String,
    enum: [
      'OFFICER', 'SUPERVISOR', 'ADMINISTRATOR', 'ROOT'
    ],
    required: true
  },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'agency',
    required: true
  },
  badge: {
    type: Number,
    required: [true, 'Badge is Required']
  },
  unit: {
    type: String,
    required: [true, 'Unit name is required']
  },
  rank: {
    type: String,
    required: [true, 'Rank is required']
  },
  agencySubscriber: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'agency'
  },
  boloSubscriber: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'bolo'
  },
  userDate: {
    type: Date,
    default: Date.now
  },
  passwordDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

var User = module.exports = mongoose.model('user', Schema);

/**
 * Create a new User
 * @param newUser a new user object to be saved
 * @param callback returns an err object if any and the user object from saving the model to
 * the controller
 */
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err)
      console.log(err);
    bcrypt.hash(newUser.password, salt, null, function(err, hash) {
      if (err)
        throw(err);
      newUser.password = hash;
      newUser.save(callback);
    })
  })
};

module.exports.findAllUsers = function(callback) {
  User.find({}).populate('agency').exec(callback);
};

//Find All Users Sorted By _______
module.exports.findAllUsersSortedByAgency = function(callback) {
  User.find({}).sort({agency: -1}).populate('agency').exec(callback);
};

module.exports.findAllUsersSortedByFirstName = function(callback) {
  User.find({}).sort({firstname: 1}).populate('agency').exec(callback);
};

module.exports.findAllUsersSortedByLastName = function(callback) {
  User.find({}).sort({lastname: 1}).populate('agency').exec(callback);
};

module.exports.findAllUsersSortedByUsername = function(callback) {
  User.find({}).sort({username: 1}).populate('agency').exec(callback);
};

module.exports.findAllUsersSortedByTier = function(callback) {
  User.find({}).sort({tier: 1}).populate('agency').exec(callback);
};
//End

module.exports.findUserByToken = function(token, callback) {
  User.findOne({resetPasswordToken: token}).populate('agency').exec(callback);
};

module.exports.findUserByUsername = function(username, callback) {
  User.findOne({username: username.toLowerCase()}).populate('agency').exec(callback);
};

module.exports.findUserByEmail = function(email, callback) {
  User.findOne({email: email.toLowerCase()}).populate('agency').exec(callback);
};

module.exports.findUserByID = function(id, callback) {
  User.findById(id).populate('agency').exec(callback);
};

module.exports.findUsersByAgencyID = function(agencyID, callback) {
  User.find({agency: agencyID}).populate('agency').exec(callback);
};

module.exports.removeUserByID = function(id, callback) {
  User.remove({_id: id}).exec(callback);
};

module.exports.removeUsersByAgencyID = function(agencyID, callback) {
  User.remove({agency: agencyID}).exec(callback);
};

module.exports.comparePassword = function(passwordToCheck, userHash, callback) {
  bcrypt.compare(passwordToCheck, userHash, function(err, result) {
    if (err)
      console.log(err);
    callback(null, result);
  });
};

module.exports.subscribeToAgencies = function(userId, agenciesId, callback) {
  User.findByIdAndUpdate(userId, {
    $addToSet: {
      agencySubscriber: {
        $each: agenciesId
      }
    }
  }, callback);
};

module.exports.unsubscribeFromAgencies = function(userId, agenciesId, callback) {
  User.findByIdAndUpdate(userId, {
    $pull: {
      agencySubscriber: {
        $in: agenciesId
      }
    }
  }, callback);
};
