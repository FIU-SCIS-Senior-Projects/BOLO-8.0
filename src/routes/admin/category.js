/**
 * This class sets the routes for the admin/category pages
 */

var router = require('express').Router();
var control = require('../../controllers/admin/category');

/**
 * These Routes are used for object interaction for the Category object
 */
router.get('/', control.listCategories);
router.get('/create', control.getCategoryForm);
router.post('/create', control.createNewCategory);
router.get('/edit/:id', control.getEditCategoryForm);
router.post('/edit/remove/:id', control.removeCategory);
router.post('/editCat/:id', control.postEditCategory);
router.get('/:id', control.getCategoryDetails);


module.exports = router;