var gulp = require('gulp');
var exec = require('gulp-exec');
var confirm = require('gulp-confirm');

/**
 * Initializes the database with default
 * agencies and sample users.
 * To run simply run "gulp initDB"
 */
gulp.task("initDB", function () {

    var options = {
        continueOnError: false,
        pipeStdout: false,
        customTemplatingThing: "initDB"
    };

    var reportOptions = {
        err: true,
        stderr: true,
        stdout: true
    };

    gulp.src('./')
        .pipe(confirm({
            question: 'This script will destroy the database and set it' +
            ' up to a default state!\n\n CONTINUE?  [y/n]',
            input: '_key:y'
        }))
        .pipe(exec('node delete-db.js', options))
        .pipe(exec.reporter(reportOptions))
        .pipe(exec('node init-db.js', options))
        .pipe(exec.reporter(reportOptions));
});

/**
 * Deletes the entire database
 * Use with caution
 */
gulp.task("deleteDB", function () {

    var options = {
        continueOnError: false,
        pipeStdout: false,
        customTemplatingThing: "deleteDB"
    };
    var reportOptions = {
        err: true,
        stderr: true,
        stdout: true
    };

    gulp.src('./')
        .pipe(confirm({
            question: 'This script will destroy the database!\n\n CONTINUE? [y/n]',
            input: '_key:y'
        }))
        .pipe(exec('node delete-db.js', options))
        .pipe(exec.reporter(reportOptions));
});

/**
 * Says what happens if you type in just 'gulp' in the terminal
 */
gulp.task('default', function(){
    gulp.start('initDB');
});
