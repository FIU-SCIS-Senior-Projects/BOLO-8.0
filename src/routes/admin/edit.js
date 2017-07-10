/**
 * This class sets the routes for the admin/edit pages
 */

var router = require('express').Router();
var control = require('../../controllers/admin/edit');

// Multer is used to upload login image to the server
// It is provided in this routes file because the router.post('/login')
// route needs to handle the uploaded file. Please look at the npm multer
// documentation for how to use multer.
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + '/public/img');
  },
  filename: function (req, file, cb) {
    console.log("This is destination file : " + file);

    cb(null, 'login-image');
  }
})

const aboutUsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("This is destination file : " + file);
    cb(null, appRoot + '/public/img/');
  },
  filename: function (req, file, cb) {
    console.log("This is the file name : " + file);
    cb(null, req.body.src);
  }
})
const upload = multer({ storage });
const aboutUsUpload = multer({ aboutUsStorage });

router.get('/aboutUs', control.getAboutUsForm);
router.post('/aboutUs', control.saveAboutUs);
router.post('/uploads', aboutUsUpload.single('upload-image'), control.savingImages);
//router.post('/aboutUs', aboutUsUpload.single('file'), control.saveAboutUs);
router.get('/login', control.getLoginPageForm);
router.post('/login', upload.single('login-image'), control.saveLoginPage);
router.get('/userGuide', control.listUserGuideSectionsAndTitle);
router.post('/userGuide', control.saveUserGuideTitle);
router.get('/userGuide/add', control.getUserGuideSectionForm);
router.post('/userGuide/add', control.saveUserGuide);
router.get('/userGuide/delete/:id', control.deleteUserGuideSection);
router.get('/userGuide/preview/:user', control.previewUserGuide);
router.get('/userGuide/:id', control.getUserGuideSectionForm);
router.post('/userGuide/:id', control.saveUserGuide);
router.get('/nicEditorIcons', control.getNicEditForm);
router.post('/nicEditorIcons', control.saveNicEditForm);
router.get('/dataSubscribers', control.getDataSubscribers);


module.exports = router;
