/**
 * This class sets the controls for the aboutUs routes
 */
var fs = require('fs');
var readMultipleFiles = require('read-multiple-files');
var UserGuide = require('../../models/userguide');
var config = require('../../config');
var md = require("node-markdown").Markdown;
var updateFn = require('./updateUserGuide'); 

/**
 * Gets the about us editor
 */
exports.getAboutUsForm = function (req, res) {
    fs.readFile('./public/AboutUs.md', function (err, data) {
        if (err) {
            console.log(err);
            res.render('admin-edit-aboutUs',
                {errors: [{msg: 'Error! AboutUs.md could not be read'}]});
        } else {
            console.log('AboutUs is being read');
            res.render('admin-edit-aboutUs', {markdown: data.toString()});
        }
    })
};

exports.saveAboutUs = function (req, res) {
    var newMarkdown = req.body.in;
    console.log('Writing to system: ' + newMarkdown);
    fs.writeFile('./public/AboutUs.md', newMarkdown, function (err) {
        if (err) {
            console.log(err);
            req.flash('The file did not save...', err);
            res.render('admin-edit-aboutUs', {markdown: newMarkdown});
        } else {
            console.log('AboutUs has been over-written');
            req.flash('success_msg', 'Changes are saved');
            res.redirect('/admin/edit/aboutUs');
        }
    })
};

exports.getLoginPageForm = function (req, res) {
    fs.readFile('./public/Login.md', function (err, data) {
        if (err) {
            console.log(err);
            res.render('admin-edit-login',
                {errors: [{msg: 'Error! Login.md could not be read'}]});
        } else {
            console.log('Login is being read');
            res.render('admin-edit-login', {markdown: data.toString()});
        }
    });
};

exports.saveLoginPage = function (req, res) {
    var newMarkdown = req.body.in;
    console.log('Writing to system: ' + newMarkdown);
    fs.writeFile('./public/Login.md', newMarkdown, function (err) {
        if (err) {
            console.log(err);
            req.flash('The file did not save...', err);
            res.render('admin-edit-login', {markdown: newMarkdown});
        } else {
            console.log('Login has been over-written');
            req.flash('success_msg', 'Changes are saved');
            res.redirect('/admin/edit/login');
        }
    })
};

exports.listUserGuideSectionsAndTitle = function (req, res, next) {
   
    //Get sections
    UserGuide.findAllSections(function (err, listOfSections) {
        if (err) next(err);
        else {
            //Get title
            fs.readFile('./public/UserGuide/UserGuideTitle.md', function (err, data) {
                if (err) {
                    console.log("Reading default User Guide title"); 
                    res.render('admin-edit-userGuide', { sections: listOfSections, title: config.title });
                } else {
                    res.render('admin-edit-userGuide', { sections: listOfSections, title: data.toString() });
                }
            });
            
        }
        
    });
};

exports.saveUserGuideTitle = function (req, res, next) {
    if (req.body.title) {
        var title = req.body.title;
        fs.writeFile('./public/UserGuide/UserGuideTitle.md', title, function (err) {
            if (err) {
                req.flash('error_msg', 'User Guide title could not be updated');
                res.redirect('/admin/edit/userGuide/');
            } else {
                updateFn.updateUserGuide(true, true, true, true);
                req.flash('success_msg', 'User Guide Title Successfully Updated!');
                res.redirect('/admin/edit/userGuide/');
            }
        });
    } else {
        req.flash('error_msg', 'A title for the User Guide is required');
        res.redirect('/admin/edit/userGuide/');
    }
};

exports.getUserGuideSectionForm = function (req, res) {
    if (req.params.id) {
        UserGuide.findSectionByID(req.params.id, function (err, section) {
            if (err) {
                req.flash('error_msg', 'Could not find section details');
                res.redirect('/admin/edit/userGuide');
            } else {
                //Get form for specific section
                if (section) {
                    fs.readFile('./public/UserGuide/' + section.id + '.md', function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var preFill = {
                                title1: section.title,
                                data: data.toString(),
                                OFFICER: section.OFFICER,
                                SUPERVISOR: section.SUPERVISOR,
                                ADMINISTRATOR: section.ADMINISTRATOR,
                                ROOT: section.ROOT,
                                id : section.id
                            };
                            res.render('admin-edit-userGuide-section', preFill);
                        }
                    });
                //Section not found
                } else {
                    req.flash('error_msg', 'Could not find section details');
                    res.redirect('/admin/edit/userGuide');
                }
            }
        });
    //Get new form
    } else {
        var preFill = {
            title1: '',
            data: '',
            OFFICER: false,
            SUPERVISOR: false,
            ADMINISTRATOR: false,
            ROOT: false
        };
        res.render('admin-edit-userGuide-section', preFill);
    }    
};

exports.saveUserGuide = function (req, res) {

    //Get previous form data
    var prevForm = {
        title1: (req.body.title) ? req.body.title : '',
        data: (req.body.data) ? req.body.data : ''
    };

    prevForm.OFFICER = ((req.body.level) && ((req.body.level).indexOf("OFFICER") >= 0)) ? true : false;
    prevForm.SUPERVISOR = ((req.body.level) && ((req.body.level).indexOf("SUPERVISOR") >= 0)) ? true : false;
    prevForm.ADMINISTRATOR = ((req.body.level) && ((req.body.level).indexOf("ADMINISTRATOR") >= 0)) ? true : false;
    prevForm.ROOT = ((req.body.level) && ((req.body.level).indexOf("ROOT") >= 0)) ? true : false;

    //Validation of form
    var errors = [];
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('data', 'Instructions are required').notEmpty();

    var valErrors = req.validationErrors();
    for (var x in valErrors)
        errors.push(valErrors[x]);

    //If at least one error was found
    if (errors.length) {
        if (req.params.id) prevForm.id = req.params.id;
        prevForm.errors = errors;
        res.render('admin-edit-userGuide-section', prevForm);
    }

    //Update section
    else if (req.params.id) {
        UserGuide.findSectionByID(req.params.id, function (err, section) {
            if (err) {
                req.flash('error_msg', 'Could not find user guide section');
                res.redirect('/admin/edit/userGuide');
            } else {

                //Get what is originally saved in the database to compare changes
                var prevData = {
                    OFFICER: section.OFFICER,
                    SUPERVISOR: section.SUPERVISOR,
                    ADMINISTRATOR: section.ADMINISTRATOR,
                    ROOT: section.ROOT,
                };

                section.title = req.body.title;
                section.OFFICER = ((req.body.level) && ((req.body.level).indexOf("OFFICER") >= 0)) ? true : false;
                section.SUPERVISOR = ((req.body.level) && ((req.body.level).indexOf("SUPERVISOR") >= 0)) ? true : false;
                section.ADMINISTRATOR = ((req.body.level) && ((req.body.level).indexOf("ADMINISTRATOR") >= 0)) ? true : false;
                section.ROOT = ((req.body.level) && ((req.body.level).indexOf("ROOT") >= 0)) ? true : false;

                var data = req.body.data;

                section.save(function (err) {
                    if (err) {
                        req.flash('error_msg', section.title + ' section could not be saved');
                        res.redirect('/admin/edit/userGuide/');
                    } else {
                        fs.writeFile('./public/UserGuide/' + section.id + '.md', data, function (err) {
                            if (err) {
                                req.flash('error_msg', section.title + ' section could not be saved');
                                res.redirect('/admin/edit/userGuide/');
                            } else {
                                console.log(section.title + ' file updated');
                            }
                        });
                        //Need to update userguides where the access level has changed
                        updateFn.updateUserGuide(section.OFFICER || prevData.OFFICER,
                                                section.SUPERVISOR || prevData.SUPERVISOR,
                                                section.ADMINISTRATOR || prevData.ADMINISTRATOR,
                                                section.ROOT || prevData.ROOT);
                        req.flash('success_msg', section.title + ' has been Updated!');
                        res.redirect('/admin/edit/userGuide/');
                    }
                })
            }
        })
    //Create section
    } else {
       
       var newSection = new UserGuide();
       newSection.title = req.body.title;
       newSection.OFFICER = ((req.body.level) && ((req.body.level).indexOf("OFFICER") >= 0)) ? true : false;
       newSection.SUPERVISOR = ((req.body.level) && ((req.body.level).indexOf("SUPERVISOR") >= 0)) ? true : false;
       newSection.ADMINISTRATOR = ((req.body.level) && ((req.body.level).indexOf("ADMINISTRATOR") >= 0)) ? true : false;
       newSection.ROOT = ((req.body.level) && ((req.body.level).indexOf("ROOT") >= 0)) ? true : false;
           
       var data = req.body.data;

       newSection.save(function (err, section) {
           if (err) {
               console.log(newSection.title + ' section could not be saved: \n' + err);
           } else {

               fs.writeFile('./public/UserGuide/' + section.id + '.md', data, function (err) {
                   if (err) {
                       req.flash('error_msg', section.title + ' section could not be saved');
                       res.redirect('/admin/edit/userGuide/');
                   } else {
                       console.log(section.title + ' file created');
                   }
               });
               updateFn.updateUserGuide(section.OFFICER, section.SUPERVISOR, section.ADMINISTRATOR, section.ROOT);
               req.flash('success_msg', section.title + ' has been Created!');
               res.redirect('/admin/edit/userGuide/');
           }
       });
    }
};

exports.deleteUserGuideSection = function (req, res) {
    UserGuide.findSectionByID(req.params.id, function (err, section) {
        if (err) {
            req.flash('error_msg', 'Could not find user guide section');
            res.redirect('/admin/edit/userGuide');
        } else {
            UserGuide.removeUserGuideSection(req.params.id, function (err) {
                if (err) {
                    req.flash('error_msg', 'Could not delete ' + section.title);
                    res.redirect('/admin/edit/userGuide');
                } else {
                    //Remove file
                    fs.unlink('./public/UserGuide/' + req.params.id + '.md', function (err) {
                        if (err) console.log('Could not delete ' + req.params.id + '.md');
                        updateFn.updateUserGuide(true, true, true, true);
                        req.flash('success_msg', section.title + ' has been deleted!');
                        res.redirect('/admin/edit/userGuide');
                    });  
                }
            });
        }
    });
};

exports.previewUserGuide = function (req, res) {
   
    var file = '';

    if (req.params.user == "root")          file = './public/UserGuide/Root.md';
    if (req.params.user == "supervisor")    file = './public/UserGuide/Supervisor.md';
    if (req.params.user == "administrator") file = './public/UserGuide/Administrator.md';
    if (req.params.user == "officer")       file = './public/UserGuide/Officer.md';

    fs.readFile(file, function (err, data) {
        if (err) {
            req.flash('error_msg', 'User Guide could not be found!');
            res.redirect('/admin/edit/userGuide');
        } else {
            res.render('admin-edit-userGuide-preview', { md: md, text: data.toString(), user : req.params.user });

        }
    });
};