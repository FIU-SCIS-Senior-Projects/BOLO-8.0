/**
 * This class sets the routes for the bolo pages
 */

var router = require('express').Router();
var control = require('../controllers/bolo');

var multer = require('multer');
var upload = multer();
var boloImages = upload.fields([{name: 'featured', maxCount: 1},
    {name: 'other1', maxCount: 1}, {name: 'other2', maxCount: 1}]);

router.get('/', control.renderBoloPage);
router.get('/create', control.getCreateBolo);
router.post('/create', boloImages, control.postCreateBolo);
router.get('/search', control.getBoloSearch);
router.post('/search', control.postBoloSearch);
router.get('/archive', control.renderArchivedBolos);
router.get('/list', control.listBolos);
router.get('/:id', control.getBoloDetails);
router.post('/subscribe/:id', control.subscribeToBOLO);
router.post('/unsubscribe/:id', control.unsubscribeFromBOLO);
router.get('/pdf/:id', control.renderBoloAsPDF);
router.post('/archive', control.renderPurgeArchivedBolosPage);
router.post('/archive/purge/:id', control.purgeArchivedBolos);
router.get('/archive/purge/:id', control.renderPurgeArchivedBolosPage);
router.post('/archive/:id', control.archiveBolo);
router.post('/unarchive/:id', control.unArchiveBolo);
router.get('/confirm/:token', control.confirmBolo);
router.get('/edit/:id', control.getEditBolo);
router.post('/edit/:id', boloImages, control.postEditBolo);
router.post('/delete/:id', control.deleteBolo);

module.exports = router;