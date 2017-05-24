var Agency = require('../models/agency');

exports.renderAgencies = function(req, res, next) {
  Agency.findAllActiveAgencies(function(err, listOfAgencies) {
    if (err)
      next(err);
    else {
      res.render('agency', {agencies: listOfAgencies});
    }
  })

};

exports.renderAgencyDetails = function(req, res) {
  Agency.findAgencyByID(req.params.id, function(err, agency) {
    if (err)
      next(err);
    else {
      res.render('agency-details', {agency: agency});
    }
  });
};
