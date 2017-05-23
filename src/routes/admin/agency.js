/**
 * This class sets the routes for the admin/agency pages
 */

var router = require('express').Router();
var control = require('../../controllers/admin/agency');

var multer = require('multer');
var upload = multer();
var agencyImages = upload.fields([{name: 'logo', maxCount: 1},
    {name: 'shield', maxCount: 1}, {name: 'watermark', maxCount: 1}]);

router.get('/', control.listAgencies);
router.get('/create', control.getCreateForm);
router.post('/create', agencyImages, control.postCreateForm);
router.get('/:id', control.getAgencyDetails);
router.post('/activation/:id', control.activationAgency);
router.get('/delete/:id', control.getDeleteAgency);
router.post('/delete/:id', control.deleteAgency);
router.get('/edit/:id', control.getEditForm);
router.post('/edit/:id', agencyImages, control.postEditForm);

module.exports = router;