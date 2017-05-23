/**
 * This class sets the routes for the reset password pages
 */

var router = require('express').Router();
var control = require('../controllers/resetPassword');

router.get('/', control.checkPassword);
router.post('/newPass', control.newPassword);
router.post('/newPass/:token', control.newPassword);
router.get('/renderResetPass', control.renderResetPassword);
router.get('/resetUserPass/:id', control.resetUserPass);

module.exports = router;
