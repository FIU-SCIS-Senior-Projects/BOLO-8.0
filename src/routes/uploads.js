/**
 * This class sets the routes for the aboutUs pages
 */

var router = require('express').Router();
var control = require('../controllers/uploads');

router.get('/', control.savingImages);
router.post('/uploads', control.savingImages);
module.exports = router;
