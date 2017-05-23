/**
 * This class sets the controls for the User Guide routes
 */

var fs = require('fs');
var md = require("node-markdown").Markdown;

/**
 * Displays the user guide for each individual tier.
 */
exports.getUserGuide = function (req, res, next) {

    var file = '';

    if (res.locals.userTier == "ROOT")  file = __dirname + '/../public/UserGuide/Root.md';
    if (res.locals.userTier == "SUPERVISOR") file = __dirname + '/../public/UserGuide/Supervisor.md';
    if (res.locals.userTier == "ADMINISTRATOR") file = __dirname + '/../public/UserGuide/Administrator.md';
    if (res.locals.userTier == "OFFICER") file = __dirname + '/../public/UserGuide/Officer.md';
    
    fs.readFile(file, function (err, data) {
        if (err) req.flash('error_msg', 'User Guide could not be found!');
        else {
            res.render('user-guide', {md: md, text: data.toString()});
        }
    });
};

