var Category = require('../../models/category');
var Bolo = require('../../models/bolo');
/**
 * Error handling for MongoDB
 */
var getErrorMessage = function(err) {
  var message = [];
  for (var errName in err.errors) {
    if (err.errors[errName].message) {
      message.push({msg: err.errors[errName].message});
    }
  }
  return message;
};

exports.listCategories = function(req, res, next) {
  Category.findAllCategories(function(err, listOfCategories) {
    if (err)
      next(err);
    res.render('admin-category', {categories: listOfCategories})
  })
};

exports.getCategoryForm = function(req, res) {
  res.render('admin-category-create');
};

exports.getCategoryDetails = function(req, res) {
  Category.findCategoryByID(req.params.id, function(err, category) {
    if (err) {
      req.flash('error_msg', 'Could not get category details');
      res.redirect('/admin/category');
    } else {
      res.render('admin-category-details', {category: category});
    }
  });
};

exports.createNewCategory = function(req, res) {
  //Holds previously entered form data
  var prevForm = {
    name1: req.body.name
  };

  //Validation of form
  req.checkBody('name', 'A category name is required').notEmpty();
  req.checkBody('fields', 'Need At least one field to continue').notEmpty();
  var errors = req.validationErrors();

  //If at least one error was found
  if (errors) {
    console.log('Validation has failed');
    prevForm.errors = errors;
    res.render('admin-category-create', prevForm // If the form is valid
    );
  } else {
    var newCategory = new Category({name: req.body.name, fields: req.body.fields});
    //IF they are previewing then render the Preview
    if (req.body.option === "preview") {
      res.render('admin-category-preview', {category: newCategory} //They are submitting and want to create a new category. A new category is created.
      );
    } else {
      Category.createCategory(newCategory, function(err, category) {
        if (err) {
          console.log('Save Category has failed');
          prevForm.errors = getErrorMessage(err);
          res.render('admin-category-create', prevForm);
        } else {
          req.flash('success_msg', 'Category ' + category.name + ' has been created');
          res.redirect('/admin/category/create');
        }
      });
    }

  }
};

exports.getEditCategoryForm = function(req, res) {
  Category.findCategoryByID(req.params.id, function(err, category) {
    if (err) {
      req.flash('error_msg', 'Could not get category details');
      res.redirect('/admin/category');
    } else {
      res.render('admin-category-edit', {category: category});
    }
  });

};

exports.postEditCategory = function(req, res, next) {
  var prevForm = {
    name1: req.body.name
  };

  //Validation of form
  req.checkBody('name', 'A category name is required').notEmpty();
  req.checkBody('fields', 'Need At least one field to continue').notEmpty();
  var errors = req.validationErrors();

  //If at least one error was found
  if (errors) {
    console.log('Validation has failed');
    prevForm.errors = errors;
    res.render('admin-category-create', prevForm);
  } else {
    Category.findCategoryByID(req.params.id, function(err, category) {
      if (err)
        next(err);
      console.log("I FOUND THE CATEGORY");
      //Update the category
      if (req.body.name)
        category.name = req.body.name;
      if (req.body.fields)
        category.fields = req.body.fields;

      //IF they are previewing then render then Preview
      if (req.body.option === "preview") {
        res.render('admin-category-preview', {category: category} //They are submitting and want to update the category. the category is saved.
        );
      } else {
        category.save(function(err) {
          if (err) {
            req.flash('error_msg', getErrorMessage(err)[0].msg);
            res.redirect('/admin/category/edit/' + req.params.id);
          } else {

            req.flash('success_msg', 'Category has been Updated!');
            res.redirect('/admin/category/');
          }
        });
      }

    })
  }

};

exports.removeCategory = function(req, res, next) {
  Bolo.findBoloByCategoryID(req.params.id, function(err, boloFound) {
    if (err)
      next(err);
    else {
      console.log("Bolo found \n" + boloFound);
      if (boloFound) {
        req.flash('error_msg', 'Category cannot be deleted while being in use by a BOLO!');
        res.redirect('/admin/category/');
      } else {
        Category.removeCategory(req.params.id, function(err) {
          if (err)
            next(err);
          else {
            console.log("BOLO is deleted");
            req.flash('success_msg', 'Category has been deleted!');
            res.redirect('/admin/category/');
          }
        });
      }
    }
  });
};
