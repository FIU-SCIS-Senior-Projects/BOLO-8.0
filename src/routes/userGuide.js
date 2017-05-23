/**
 * This class sets the routes for the UserGuide pages
 */

var router = require('express').Router();
var control = require('../controllers/userGuide');

router.get('/', control.getUserGuide);

module.exports = router;

