/**
 * This file configures the MongoDB Database, constant values, and other settings
 * @type {exports|module.exports}
 */

//Provides utilities for working with file and directory paths
var path = require('path');

//Provides a declarative way of validating javascript objects
var validate = require('validate.js');

require('dotenv').config({
    'path': path.resolve(__dirname, '../.env')
});

var core = path.resolve(__dirname, '../core');
var config = {};

/* Application Config */
config.appURL = process.env.APP_URL || 'http://localhost:3000';

var bootswatch_theme = 'yeti-custom';
config.bootstrap = '/css/vendor/bootswatch/' +
    bootswatch_theme + '/bootstrap.min.css';

config.const = {
    pdf_view_path: path.resolve(__dirname, './views/pdf-view'),
    /* BOLO Page Settings todo*/
    BOLOS_PER_QUERY: 100,

    /* http://momentjs.com/docs/#/displaying/ */
    DATE_FORMAT: 'MM-DD-YY HH:mm:ss',
};

// Sets the number of days a bolo can remain unconfirmed before expiring
config.days = 30;
config.unconfirmedBoloLifetime = config.days * 24 * 60 * 60 * 1000;
config.max_age = 1000 * 15 * 60;

// Sets the number of times a user can attempt a log in before being locked out
config.maxNumberOfLogInAttempts = 10;

//Database configuration
config.db = 'mongodb://localhost:27017/BOLO';
config.host = 'localhost';
config.dbport = 27017;
config.collection = 'BOLO';

//Root password (TODO remove after development for security)
config.rootPasswd = '1234';

//Email configuration for conformations
config.email = {
    'from': 'noreply@boloflyer.com',
    'fromName': 'BOLO Flier Creator',
    'template_path': path.resolve(__dirname, './views/email')
};

//Default title for the User Guide
config.title = 'Welcome to the User Guide';

/**
 * Validation Policy
 *
 * @see http://validatejs.org#validators for documentation detailing the list
 * of pre-defined validators or how to create custom validators
 */
config.validation = {
    'password': {
        presence: true,
        /* https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Proper_Password_Strength_Controls */
        length: {
            minimum: 10,
            maximum: 128
        },
        /* https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository
         * 10 to 128 character password requiring at least 3 out 4 (uppercase
         * and lowercase letters, numbers and special characters) and no more
         * than 2 equal characters in a row
         * Symbols: ! ~ < > , ; : _ = ? * + # . " & § % ° ( ) | [ ] - $ ^ @ /
         */
        format: {
            pattern: /^(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))(?!.*(.)\1{2,})[A-Za-z0-9!~<>,;:_=?*+#."&§%°()\|\[\]\-\$\^\@\/]{10,128}$/,
            message: ' must contain at least 3 out of 4 (uppercase and ' +
            'lowercase letters, numbers and special characters) and no ' +
            'more than 2 equal characters in a row. Valid special ' +
            'characters: ! ~ < > , ; : _ = ? * + # . " & § % ° ( ) | [ ' +
            '] - $ ^ @ /'
        }
    }
};

/* Export the config object */
module.exports = config;
