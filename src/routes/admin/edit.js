/**
 * This class sets the routes for the admin/edit pages
 */

var router = require('express').Router();
var control = require('../../controllers/admin/edit');

router.get('/aboutUs', control.getAboutUsForm);
router.post('/aboutUs', control.saveAboutUs);
router.get('/login', control.getLoginPageForm);
router.post('/login', control.saveLoginPage);
router.get('/userGuide', control.listUserGuideSectionsAndTitle);
router.post('/userGuide', control.saveUserGuideTitle);
router.get('/userGuide/add', control.getUserGuideSectionForm);
router.post('/userGuide/add', control.saveUserGuide);
router.get('/userGuide/delete/:id', control.deleteUserGuideSection);
router.get('/userGuide/preview/:user', control.previewUserGuide); 
router.get('/userGuide/:id', control.getUserGuideSectionForm);
router.post('/userGuide/:id', control.saveUserGuide);

module.exports = router;