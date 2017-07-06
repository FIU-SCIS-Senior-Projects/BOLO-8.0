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
    enum: [
      'ACTIVE', 'FOUND', 'ARRESTED', 'RESOLVED'
    ],
    required: true
  },
  featured: {
    data: Buffer,
    contentType: String,
	  width: Number,
	  height: Number
  },
  other1: {
    data: Buffer,
    contentType: String,
	  width: Number,
	  height: Number
  },
  other2: {
    data: Buffer,
    contentType: String,
	  width: Number,
	  height: Number
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

// Create text index to enable full-text search functionality
Schema.index(
  {
    fields: 'text',
    videoURL: 'text',
    info: 'text',
    summary: 'text',
    status: 'text'
  },
  {
    name: 'full-text search',
    weights: {
      fields: 8,
      summary: 4,
      info: 2,
      videoURL: 1,
      status: 1
    }
  }
);

var Bolo = module.exports = mongoose.model('bolo', Schema);

module.exports.findBoloByID = function(id, callback) {
  Bolo.findOne({_id: id}).populate('agency').populate('author').populate('category').exec(callback);
};

module.exports.findAllBolos = function(tier, req, isConfirmed, isArchived, limit, sortBy, callback) {
  if(tier !== 'ROOT'){
    Bolo.find({
      isConfirmed: isConfirmed,
      isArchived: isArchived,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
                 agency: req.user.agency.id
            }
          ]
        }
      ]
    }).populate('agency').populate('author').populate('category').limit(limit).sort([
      [sortBy, -1]
    ]).exec(callback);
  }
  else
  {
    Bolo.find({
      isConfirmed: isConfirmed,
      isArchived: isArchived,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }).populate('agency').populate('author').populate('category').limit(limit).sort([
      [sortBy, -1]
    ]).exec(callback);
  }
};

module.exports.findOldestArchivedBolos = function(tier, req, limit, sortBy, callback) {
  if(tier !== 'ROOT')
  {
    Bolo.find({
      isConfirmed: true,
      isArchived: true,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
              agency: req.user.agency.id
            }
          ]
        }
      ]
    }).populate('agency').populate('author').populate('category').limit(limit).sort([
      [sortBy, 1]
    ]).exec(callback);
  }
  else
  {
    Bolo.find({
      isConfirmed: true,
      isArchived: true,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }).populate('agency').populate('author').populate('category').limit(limit).sort([
      [sortBy, 1]
    ]).exec(callback);

  }
};

module.exports.findBolosLessThan = function(tier, req, lessThanDate, sortBy, callback) {
  if(tier !== 'ROOT')
  {
    Bolo.find({
      isConfirmed: true,
      isArchived: true,
      'reportedOn': {
        $lte: lessThanDate
      },
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
              agency: req.user.agency.id
            }
          ]
        }
      ]
    }).populate('agency').populate('author').populate('category').sort([
      [sortBy, -1]
    ]).exec(callback);
  }
  else {
    Bolo.find({
      isConfirmed: true,
      isArchived: true,
      'reportedOn': {
        $lte: lessThanDate
      },
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }).populate('agency').populate('author').populate('category').sort([
      [sortBy, -1]
    ]).exec(callback);
  }
};

module.exports.findArchivedBolos = function(tier, req, sortBy, callback) {
  if(tier !== 'ROOT')
  {
    Bolo.find({
      isConfirmed: true,
      isArchived: true,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
              agency: req.user.agency.id
            }
          ]
        }
      ]
    }).populate('agency').populate('author').populate('category').sort([
      [sortBy, -1]
    ]).exec(callback);
  }
  else {
    Bolo.find({
      isConfirmed: true,
      isArchived: true,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }).populate('agency').populate('author').populate('category').sort([
      [sortBy, -1]
    ]).exec(callback);
  }
};

module.exports.findBolosByAuthor = function(authorID, isConfirmed, isArchived, limit, sortBy, callback) {
  Bolo.find({author: authorID, isConfirmed: isConfirmed, isArchived: isArchived}).populate('agency').populate('author').populate('category').limit(limit).sort([
    [sortBy, -1]
  ]).exec(callback);
};
module.exports.findBolosByAgencyID = function(tier, req, agencyID, isConfirmed, isArchived, limit, sortBy, callback) {
  if(tier !== 'ROOT')
  {
    Bolo.find({
      agency: agencyID,
      isConfirmed: isConfirmed,
      isArchived: isArchived,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
              agency: req.user.agency.id
            }
          ]
        }
      ]
    }).populate('agency').populate('author').populate('category').limit(limit).sort([
      [sortBy, -1]
    ]).exec(callback);
  }
  else {
    Bolo.find({
      agency: agencyID,
      isConfirmed: isConfirmed,
      isArchived: isArchived,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }).populate('agency').populate('author').populate('category').limit(limit).sort([
      [sortBy, -1]
    ]).exec(callback);
  }
};

module.exports.findBolosByInternal = function(tier, req, isConfirmed, isArchived, limit, sortBy, onlyMyAgencyInternals, callback) {
  if(tier !== 'ROOT')
  {
    Bolo.find({
      isConfirmed: isConfirmed,
      isArchived: isArchived,
      $and: [
        {
          internal: true
        }, {
          agency: req.user.agency.id
        }
      ]
    }).populate('agency').populate('author').populate('category').limit(limit).sort([
      [sortBy, -1]
    ]).exec(callback);
  }
  else
  {
    console.log('last value of onlyMyAgencyInternals:', onlyMyAgencyInternals);
    console.log(typeof(onlyMyAgencyInternals));
    if (onlyMyAgencyInternals) {
      console.log('showing my agency internals only');
      Bolo.find({
        isConfirmed: isConfirmed,
        isArchived: isArchived,
        internal: true,
        agency: req.user.agency.id
      }).populate('agency').populate('author').populate('category').limit(limit).sort([
        [sortBy, -1]
      ]).exec(callback);
    } else {
      console.log('showing all internals');
      Bolo.find({
        isConfirmed: isConfirmed,
        isArchived: isArchived,
        internal: true
      }).populate('agency').populate('author').populate('category').limit(limit).sort([
        [sortBy, -1]
      ]).exec(callback);
    }
  }
};

//unused function?
module.exports.findAllBolosByAgencyID = function(req, agencyID, callback) {
  Bolo.find({
    agency: agencyID,
    isConfirmed: true,
    $or: [
      {
        internal: false
      }, {
        internal: null
      }, {
        $and: [
          {
            internal: true
          }, {
            agency: req.user.agency.id
          }
        ]
      }
    ]
  }).exec(callback);
};

//left off here
module.exports.findBoloByCategoryID = function(id, callback) {
  Bolo.findOne({category: id}).exec(callback);
};

module.exports.findIfEmailIsInBolo = function(boloID, email, callback) {
  Bolo.find({_id: boloID, subscribers: email}).exec(callback);
};

module.exports.subscribeToBOLO = function(boloId, email, callback) {
  Bolo.findByIdAndUpdate(boloId, {
    $addToSet: {
      subscribers: email
    }
  }, {
    safe: true,
    upsert: true
  }, callback);
};

module.exports.unsubscribeFromBOLO = function(boloId, email, callback) {
  Bolo.findByIdAndUpdate(boloId, {
    $pullAll: {
      subscribers: [email]
    }
  }, callback);
};

//another unused?
module.exports.findBolosByAgencyIDs = function(req, agencyIDs, isConfirmed, isArchived, limit, sortBy, callback) {
  Bolo.find({
    agency: {
      $in: agencyIDs
    },
    isConfirmed: isConfirmed,
    isArchived: isArchived,
    $or: [
      {
        internal: false
      }, {
        internal: null
      }, {
        $and: [
          {
            internal: true
          }, {
            agency: req.user.agency.id
          }
        ]
      }
    ]
  }).populate('agency').populate('author').populate('category').limit(limit).sort([
    [sortBy, -1]
  ]).exec(callback);
};

module.exports.findBoloByToken = function(token, callback) {
  Bolo.findOne({conformationToken: token}).exec(callback);
};

module.exports.addDataSubscriberEmailToBolo = function(boloID, emailToAdd, callback) {
  Bolo.findByIdAndUpdate(boloID, {
    $push: {
      subscribers: emailToAdd
    }
  }, {
    safe: true,
    upsert: true
  }, callback);
};

module.exports.searchAllBolosByAgencyAndCategory = function(tier, req, agencyID, categoryID, fieldsArray, callback) {
  console.log('Searching for AgencyID: ' + agencyID + ', categoryID: ' + categoryID + ', fieldsArray: ' + fieldsArray);
  if (!Array.isArray(fieldsArray))
    fieldsArray = [fieldsArray];

  var isFieldsArrayEmpty = 0;
  for (var item = 0; item < fieldsArray.length; item++) {
    if (fieldsArray[item] !== '')
      isFieldsArrayEmpty++;
    }

  if (!categoryID){
    if(tier !== 'ROOT')
    {
      Bolo.find({
        agency: agencyID,
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            $and: [
              {
                internal: true
              }, {
                agency: req.user.agency.id
              }
            ]
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
    else {
      Bolo.find({
        agency: agencyID,
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            internal: true
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
  }
  else if (!isFieldsArrayEmpty){
    if(tier !== 'ROOT'){
      Bolo.find({
        agency: agencyID,
        category: categoryID,
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            $and: [
              {
                internal: true
              }, {
                agency: req.user.agency.id
              }
            ]
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
    else{
      Bolo.find({
        agency: agencyID,
        category: categoryID,
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            internal: true
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
  }
  else{
    if(tier !== 'ROOT'){
      Bolo.find({
        agency: agencyID,
        category: categoryID,
        fields: {
          $in: fieldsArray
        },
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            $and: [
              {
                internal: true
              }, {
                agency: req.user.agency.id
              }
            ]
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
    else{
      Bolo.find({
        agency: agencyID,
        category: categoryID,
        fields: {
          $in: fieldsArray
        },
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            internal: true
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
  }
  }
;

module.exports.searchAllBolosByCategory = function(tier, req, categoryID, fieldsArray, callback) {
  console.log('Searching for categoryID: ' + categoryID + ', fieldsArray: ' + fieldsArray);
  if (!Array.isArray(fieldsArray))
    fieldsArray = [fieldsArray];

  var isFieldsArrayEmpty = 0;
  for (var item = 0; item < fieldsArray.length; item++) {
    if (fieldsArray[item] !== '')
      isFieldsArrayEmpty++;
    }

  if (!categoryID){
      if(tier !== 'ROOT')
      {
        Bolo.find({
          isConfirmed: true,
          isArchived: false,
          $or: [
            {
              internal: false
            }, {
              internal: null
            }, {
              $and: [
                {
                  internal: true
                }, {
                  agency: req.user.agency.id
                }
              ]
            }
          ]
        }).populate('agency').populate('author').populate('category').sort([
          ['createdOn', -1]
        ]).exec(callback);
      }
      else {
        Bolo.find({
          isConfirmed: true,
          isArchived: false,
          $or: [
            {
              internal: false
            }, {
              internal: null
            }, {
              internal: true
            }
          ]
        }).populate('agency').populate('author').populate('category').sort([
          ['createdOn', -1]
        ]).exec(callback);
      }
  }
  else if (!isFieldsArrayEmpty){
      if(tier !== 'ROOT'){
        Bolo.find({
          category: categoryID,
          isConfirmed: true,
          isArchived: false,
          $or: [
            {
              internal: false
            }, {
              internal: null
            }, {
              $and: [
                {
                  internal: true
                }, {
                  agency: req.user.agency.id
                }
              ]
            }
          ]
        }).populate('agency').populate('author').populate('category').sort([
          ['createdOn', -1]
        ]).exec(callback);
      }
      else{
        Bolo.find({
          category: categoryID,
          isConfirmed: true,
          isArchived: false,
          $or: [
            {
              internal: false
            }, {
              internal: null
            }, {
              internal: true
            }
          ]
        }).populate('agency').populate('author').populate('category').sort([
          ['createdOn', -1]
        ]).exec(callback);
      }
  }
  else{
    if(tier !== 'ROOT'){
      Bolo.find({
        category: categoryID,
        fields: {
          $in: fieldsArray
        },
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            $and: [
              {
                internal: true
              }, {
                agency: req.user.agency.id
              }
            ]
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
    else{
      Bolo.find({
        category: categoryID,
        fields: {
          $in: fieldsArray
        },
        isConfirmed: true,
        isArchived: false,
        $or: [
          {
            internal: false
          }, {
            internal: null
          }, {
            internal: true
          }
        ]
      }).populate('agency').populate('author').populate('category').sort([
        ['createdOn', -1]
      ]).exec(callback);
    }
  }

  }
;

module.exports.deleteBolo = function(id, callback) {
  Bolo.remove({_id: id}).exec(callback);
};

module.exports.removeAuthorFromBolos = function(authorID, nullID, callback) {
  Bolo.update({
    author: authorID
  }, {
    author: nullID
  }, {
    multi: true
  }, callback);
};

module.exports.deleteAllArchivedBolos = function(tier, req, callback) {
  if(tier !== 'ROOT')
  {
    Bolo.remove({
      isArchived: true,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
              agency: req.user.agency.id
            }
          ]
        }
      ]
    }).exec(callback);
  }
  else {
    Bolo.remove({
      isArchived: true,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }).exec(callback);
  }
};

module.exports.deleteBolosLessThan = function(tier, req, lessThanDate, callback) {
  if(tier !== 'ROOT')
  {
    Bolo.remove({
      isArchived: true,
      'reportedOn': {
        $lte: lessThanDate
      },
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
              agency: req.user.agency.id
            }
          ]
        }
      ]
    }).exec(callback);
  }
  else {
    Bolo.remove({
      isArchived: true,
      'reportedOn': {
        $lte: lessThanDate
      },
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }).exec(callback);
  }
};

// search logic for root users
const rootSearch = (searchTerm, currentUserAgency, callback) => {
  Bolo.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: 'textScore' } },
    {
      isConfirmed: true,
      isArchived: false,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          $and: [
            {
              internal: true
            }, {
              agency: currentUserAgency
            }
          ]
        }
      ]
    }
  ).populate('agency').populate('author').populate('category').sort({
    score: { $meta: 'textScore' }
  }).exec(callback);
};

// search logic for regular users
const userSearch = (searchTerm, callback) => {
  Bolo.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: 'textScore' } },
    {
      isConfirmed: true,
      isArchived: false,
      $or: [
        {
          internal: false
        }, {
          internal: null
        }, {
          internal: true
        }
      ]
    }
  ).populate('agency').populate('author').populate('category').sort({
    score: { $meta: 'textScore' }
  }).exec(callback);
};

// Arguments:
// 1. Options object with properties searchTerm, currentUserAgency, and tier
// 2. Callback that is called after the mongodb search is done.
module.exports.wildcardSearch = ({ searchTerm, req, currentUserAgency, tier }, callback) => {
  if (!searchTerm) {
    console.log('term empty');
    // add logic for when no term is entered.
    // results should just match the agency and category
    module.exports.findAllBolos(tier, req, true, false, 1000, 'createdOn', callback);
  } else {
    if (tier !== 'ROOT') {
      rootSearch(searchTerm, currentUserAgency, callback);
    }
    else {
      userSearch(searchTerm, callback);
    }
  }
}
