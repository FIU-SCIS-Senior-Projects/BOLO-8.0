/**
 * This class sets the routes for the admin/users pages
 */

var router = require('express').Router();
var control = require('../../controllers/admin/user.js');

var multer = require('multer');
var upload = multer({dest: './uploads/'});
var csv = upload.fields([
  {
    name: 'csvfile',
    maxCount: 1
  }
]);

router.get('/', control.getList);
router.get('/sorted/:id', control.getSortedList);
router.get('/create', control.getCreateForm);
router.post('/create', control.postCreateForm);
router.get('/multiple', control.getCSVForm);
router.post('/multiple', csv, control.multiUserCreate);
router.get('/:id', control.getDetails);
router.get('/edit/:id', control.getEditDetails);
router.post('/edit/:id', control.postEditDetails);
router.get('/delete/:id', control.getDeleteUser);
router.post('/delete/:id', control.postDeleteUser);
router.post('/activation/:id', control.activationUser);
router.get('/resetPassword/:id', control.getPasswordReset);
router.post('/resetPassword/:id', control.postPasswordReset);

module.exports = router;
