/**
 * This class sets the routes for the admin/dataAnalysis pages
 */

var router = require('express').Router();
var control = require('../../controllers/admin/dataAnalysis.js');

router.get('/', control.getDataAnalysis);
router.post('/', control.downloadCsv);

module.exports = router;