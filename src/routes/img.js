/**
 * This class sets the routes for the imgages for agencies
 */

var router = require('express').Router();
var control = require('../controllers/img');

router.get('/agency/logo/:id', control.getAgencyLogo);
router.get('/agency/shield/:id', control.getAgencyShield);
router.get('/agency/watermark/:id', control.getAgencyWatermark);
router.post('/agency/remove/logo/:id', control.removeAgencyLogo);
router.post('/agency/remove/shield/:id', control.removeAgencyShield);
router.post('/agency/remove/watermark/:id', control.removeAgencyWatermark);
router.get('/bolo/featured/:id', control.getBoloFeatured);
router.get('/bolo/other1/:id', control.getBoloOther1);
router.get('/bolo/other2/:id', control.getBoloOther2);
//router.post('/bolo/remove/featured/:id', control.removeBoloFeatured);
//router.post('/bolo/remove/other1/:id', control.removeBoloOther1);
//router.post('/bolo/remove/other2/:id', control.removeBoloOther2);

module.exports = router;
