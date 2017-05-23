/**
 * This class sets the routes for the agency pages
 */

var router = require('express').Router();
var control = require('../controllers/agency');

router.get('/', control.renderAgencies);
router.get('/:id', control.renderAgencyDetails);

module.exports = router;
