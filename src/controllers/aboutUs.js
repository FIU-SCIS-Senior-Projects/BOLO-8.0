/**
 * This class sets the controls for the aboutUs routes
 */

var fs = require('fs');
var md = require('node-markdown').Markdown;

/**
 * This function is to display the AboutUsFIU page.
 */
exports.getAboutUs = function (req, res, next) {
    fs.readFile(__dirname + '/../public/AboutUs.md', function (err, data) {
        if (err) next(err);
        else {
            res.render('about', {md: md, text: data.toString()});
        }
    });
};