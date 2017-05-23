var mongoose = require('mongoose');
var config = require('../src/config');
var fs = require('fs');
var readMultipleFiles = require('read-multiple-files');

var User = require('../src/models/user');
var UserGuide = require('../src/models/userguide');
var Agency = require('../src/models/agency');
var Category = require('../src/models/category');

var p = 1; //counter for process exit no.

mongoose.connect(config.db);
mongoose.Promise = require('bluebird');

var nullAgency = new Agency({
    name: 'NULL',
    emailDomain: 'null@null.com',
    address: 'n/a',
    city: 'n/a',
    state: 'n/a',
    zipcode: '00000',
    phone: '0000000000',
    rank: 'n/a',
});

var rootUser = new User({
    username: 'root',
    firstname: 'N/A',
    lastname: 'N/A',
    password: config.rootPasswd,
    passwordDate: new Date(8640000000000000), // Latest possible date
    email: 'null@null.com',
    tier: 'ROOT',
    badge: '0',
    unit: 'N/A',
    rank: 'N/A'
});

//Categories

var autoCategory = new Category({
    name: 'Auto Theft',
    fields: ['Year', 'Make', 'Model', 'Style', 'Color',
        'VIN Number', 'License Plate State', 'License Plate Number']
});

var boatCategory = new Category({
    name: 'Boat Theft',
    fields: ['Year', 'Manufacturer', 'Model', 'Type', 'Length - Feet',
        'Color', 'Hull Identification Number', 'Registration State', 'Registration Number',
        'Propulsion Type', 'Propulsion Make', 'Trailer Manufacturer',
        'VIN Number', 'License Plate State', 'License Plate Number']
});

var generalCategory = new Category({
    name: 'General',
    fields: ['Category (Arson, Missing Person, ...)', 'First Name', 'Last Name',
        'Date of Birth (DD/MM/YYYY)', 'Drivers License Number', 'Address', 'Zip Code',
        'Race', 'Sex', 'Height', 'Weight', 'Hair Color', 'Tattoos']
});

nullAgency.save(function (err, agency) {
    if (err) {
        console.log('Null Agency could not be saved:' + err);
        process.exit(p++);
    } else {
        console.log('Null Agency has been registered: ' + agency);
        rootUser.agency = agency._id;
        User.createUser(rootUser, function (err, user) {
            if (err) {
                console.log('root user could not be saved: ' + err);
                process.exit(p++);
            } else {
                console.log('root user has been registered: ' + user);
                autoCategory.save(function (err) {
                    if (err) {
                        console.log('Error saving categories: ' + err);
                        process.exit(p++);
                    } else {
                        boatCategory.save(function (err) {
                            if (err) {
                                console.log('Error saving categories: ' + err);
                                process.exit(p++);
                            } else {
                                generalCategory.save(function (err) {
                                    if (err) {
                                        console.log('Error saving categories: ' + err);
                                        process.exit(p++);
                                    } else {
                                        console.log('3 Categories have been registered: ' + user);
                                        console.log('The database has been initialized');
                                    }
                                })
                            }
                        })
                    }
                });
            }
        })
    }
});


//User Guide

function saveUserGuideSection(section, steps) {
    section.save(function (err, content) {
        if (err) {
            console.log(content.title + ' section could not be saved:' + err);
            process.exit(p++);
        } else {
            console.log(content.title + ' section has been added: ' + content);
            fs.writeFile('../src/public/UserGuide/' + content.id + '.md', steps, function (err) {
                if (err) {
                    console.log(content.title + ' section could not be saved: ' + err);
                    process.exit(p++);
                } else {
                    console.log(content.title + ' file created');
                    return true;
                }
            });
        }
    });
}

var agencyManagement_R = new UserGuide({
    title: 'Agency Management',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: false,
    ROOT: true
});

var agencyManagementSteps_R =
    "1) Click on 'Admin'\n" +
    "2) Click on 'Agency Management'\n" +
    "* * Create a new Agency * *\n" +
    "3) Click on 'Add new agency'\n" +
    "4) Fill in all fields (required)\n" +
    "5) Select new agency logo (required)\n" +
    "6) Select new agency shield (required)\n" +
    "7) Enter a 'Water Mark' image (optional)\n" +
    "8) Click 'Submit'\n" +
    "* * Update an Agency * *\n" +
    "3) Click on the 'Blue Asterisk' to the right on the agency\n" +
    "4) Enter or modify any fields required\n" +
    "5) Enter or update 'Logo' image\n" +
    "6) Enter or update 'Shield' image\n" +
    "7) Enter or update 'Water Mark' image\n" +
    "8) Click 'Submit'";

var agencyManagement_A = new UserGuide({
    title: 'Agency Management',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: true,
    ROOT: false
});

var agencyManagementSteps_A =
    "1) Click on 'Admin'\n" +
    "2) Click on 'Agency Management'\n" +
    "3) Click on the 'Blue Asterisk' to the right on the agency'\n" +
    "4) Enter or modify any fields (required)\n" +
    "5) Enter or update 'Logo' image (required)\n" +
    "6) Enter or update 'Shield' image (required)\n" +
    "7) Enter a 'Water Mark' image (optional)\n" +
    "8) Choose to allow officers to opt out of viewing BOLOs from their agency\n" +
    "9) Click 'Submit'";

var dataAnalysis = new UserGuide({
    title: 'Data Analysis',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: false,
    ROOT: true
});

var dataAnalysisSteps =
  "1) Click on 'Admin'\n" +
  "2) Click on 'Data Analysis'\n" +
  "3) Select one or more 'Agencies'\n" +
  "4) Click 'Download'";

var dataSubscriber = new UserGuide({
    title: 'Data Subscriber',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: false,
    ROOT: true
});

var dataSubscriberSteps =
    "1) Click on 'Admin'\n" +
    "2) Click on 'Data Subscriber'\n" +
    "* * Add a new Subscriber * *\n" +
    "3) Click on 'Add New Data Subscriber'\n" +
    "4) Fill in data subscriber's ID, Name and email\n" +
    "5) Click 'Submit'\n" +
    "* * Update a Subscriber * *\n" +
    "3) Click on 'Add New Data Subscriber'\n" +
    "4) Update data subscriber's ID, Name or email\n" +
    "5) Click 'Submit'\n" +
    "* * Activate or deactivate a subscriber * *\n" +
    "3) Click on the 'Blue Asterisk' to the right on the agency\n" +
    "4) Click on 'Activate/Deactivate' button'";

var systemSettings = new UserGuide({
    title: 'System Settings',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: false,
    ROOT: true
});

var systemSettingsSteps =
    "1) Click on 'Admin'\n" +
    "2) Click on 'System Settings'\n" +
    "3) Select the number of minutes for the system to time out for all users\n" +
    "* Time can be set between 10 and 240 minutes (recommended less than 60 minutes)\n" +
    "4) Set the number of brute force login attempts between 3 and 10\n" +
    "* A user locked out of the system will be required to reset their password\n" +
    "5) Click 'Submit'";

var userManagement = new UserGuide({
    title: 'User Management',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: true,
    ROOT: true
});

var userManagementSteps =
    "1) Click on 'Admin'\n" +
    "2) Click on 'User Management'\n" +
    "* * Add a new user's profile * *\n" +
    "3) Click on 'Add New User'\n" +
    "4) Fill in the empty fields (required)\n" +
    "5) Click 'Submit'\n" +
    "* * Add a new user's profile * *\n" +
    "3) Click on the 'Blue Asterisk' on the right of the user\n" +
    "4) Update required fields\n" +
    "5) Click 'Submit'";

var createBOLO = new UserGuide({
    title: 'Create a BOLO',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var createBOLOSteps =
    "1) Enter the reported time and date (required)\n" +
    "2) Fill in the category and the fields that populate\n" +
    "3) Upload available images\n" +
    "4) Add a video link (if available)\n" +
    "5) Fill in the summary\n" +
    "6) *Optional* Click the 'Preview' Button to make sure you have added everything\n" +
    "7) Click 'Back to Create BOLO' to go back to the BOLO\n" +
    "8) Repeat Steps 2 - 7 until all information is complete\n" +
    "9) Click 'Submit' to submit your BOLO\n" +
    "10) Go to to your registered email and click on the confirmation link";

var editBOLO = new UserGuide({
    title: 'Edit a BOLO',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var editBOLOSteps =
    "* * You can only edit your BOLOs * *\n" +
    "1) Click 'Edit'\n" +
    "2) Select any field you want to edit\n" +
    "3) Enter any information required\n" +
    "4) Click 'Submit'";

var viewDetails_RA = new UserGuide({
    title: 'View Details of a BOLO',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: true,
    ROOT: true
});

var viewDetailsSteps_RA =
    "1) Click 'Details'\n" +
    "2) Review details of a selected BOLO\n" +
    "3) Select 'Generate PDF' to download\n" +
    "* * View a detailed record of who has edited this BOLO * *\n" +
    "4) Select 'View Record'\n" +
    "5) Click 'Back' to go back to the BOLO details";

var viewDetails_OS = new UserGuide({
    title: 'View Details of a BOLO',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: false,
    ROOT: false
});

var viewDetailsSteps_OS =
    "1) Click 'Details'\n" +
    "2) Review details of a selected BOLO\n" +
    "3) Select 'Generate PDF' to download\n" +
    "4) Click 'Back' to go back to the BOLO details";

var filterByMe = new UserGuide({
    title: 'Filter by (Me)',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var filterByMeSteps =
    "1) Click 'Filter By'\n" +
    "2) Select filter:\n" +
    "* My BOLO\n" +
    "* My Agency\n" +
    "* All BOLOs\n" +
    "3) Results BOLOs will display";

var filterByAgency = new UserGuide({
    title: 'Filter by Agency',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var filterByAgencySteps =
    "1) Click 'Select Agency'\n" +
    "2) Select one or more agencies\n" +
    "3) Results BOLOs will display";

var archive_OS = new UserGuide({
    title: 'Archive BOLO',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: false,
    ROOT: false
});

var archiveSteps_OS =
    "* * Having access to view archived BOLOs might assist if you are looking for someone" +
    "who fits the description of another crime. * *\n" +
    "1) Click 'Archive'\n" +
    "2) Select a BOLO\n" +
    "3) Click 'View' to view the details";

var archive_A = new UserGuide({
    title: 'Archive BOLO',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: true,
    ROOT: false
});

var archiveSteps_A =
    "1) Click 'Archive\n" +
    "* * At the top of the page* *\n" +
    "2) Select a BOLO\n" +
    "3) Click:\n" +
    "* 'View' to view details\n" +
    "* 'Restore' to restore the BOLO\n" +
    "* 'Delete' to delete a BOLO\n" +
    "* * On the BOLO * *\n" +
    "Send the BOLO to the archive files";

var archive_R = new UserGuide({
    title: 'Archive BOLO',
    OFFICER: false,
    SUPERVISOR: false,
    ADMINISTRATOR: false,
    ROOT: true
});

var archiveSteps_R =
    "1) Click 'Archive\n" +
    "* * At the top of the page* *\n" +
    "2) Select a BOLO\n" +
    "3) Click:\n" +
    "* 'View' to view details\n" +
    "* 'Restore' to restore the BOLO\n" +
    "* 'Delete' to delete a BOLO\n" +
    "* 'Purge' to delete all the BOLOs at once\n" +
    "* * On the BOLO * *\n" +
    "Send the BOLO to the archive files";

var agencyDirectory = new UserGuide({
    title: 'Agency Directory',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var agencyDirectorySteps =
    "1) Click on 'Agency Directory' to view a list of partnering agencies.\n" +
    "2) Select an agency by clicking their name\n" +
    "* View contact information\n" +
    "* Verify an agency's 'Logo' and 'Shield";

var searchBOLO = new UserGuide({
    title: 'Search BOLO by field(s)',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var searchBOLOSteps =
    "1) Click 'Search'\n" +
    "2) Select any field(s) you wish to search.\n" +
    "3) Enter information value of field(s).\n" +
    "* *Wild card search is for something you cannot search with an optional search * *\n" +
    "4) Click 'Search'";

var notifications = new UserGuide({
    title: 'Get Notifications',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var notificationsSteps =
    "1) Click on your 'Username'\n" +
    "2) Click on 'Settings' from the dropdown menu\n" +
    "3) Click on 'Notifications'\n" +
    "4) Click on 'Subscribe to other Agencies at the bottom left'\n" +
    "5) Select agencies to receive notifications\n" +
    "* *You may also unsubscribe from an agency * *\n" +
    "6) Select agencies to remove from your list of Agencies\n" +
    "7) Click 'Unsubscribe Selected'";

var resetPW = new UserGuide({
    title: 'Reset Password',
    OFFICER: true,
    SUPERVISOR: true,
    ADMINISTRATOR: true,
    ROOT: true
});

var resetPWSteps =
    "1) Click on your 'Username'\n" +
    "2) Click on 'Settings' from the dropdown menu\n" +
    "3) Click 'Change Password'\n" +
    "4) Enter new password\n" +
    "5) Enter confirmation password\n" +
    "6) Click 'Submit'";

saveUserGuideSection(agencyManagement_R, agencyManagementSteps_R);
saveUserGuideSection(agencyManagement_A, agencyManagementSteps_A);
saveUserGuideSection(dataAnalysis, dataAnalysisSteps);
saveUserGuideSection(dataSubscriber, dataSubscriberSteps);
saveUserGuideSection(systemSettings, systemSettingsSteps);
saveUserGuideSection(userManagement, userManagementSteps);
saveUserGuideSection(createBOLO, createBOLOSteps);
saveUserGuideSection(editBOLO, editBOLOSteps);
saveUserGuideSection(viewDetails_RA, viewDetailsSteps_RA);
saveUserGuideSection(viewDetails_OS, viewDetailsSteps_OS);
saveUserGuideSection(filterByMe, filterByMeSteps);
saveUserGuideSection(filterByAgency, filterByAgencySteps);
saveUserGuideSection(archive_OS, archiveSteps_OS);
saveUserGuideSection(archive_A, archiveSteps_A);
saveUserGuideSection(archive_R, archiveSteps_R);
saveUserGuideSection(agencyDirectory, agencyDirectorySteps);
saveUserGuideSection(searchBOLO, searchBOLOSteps);
saveUserGuideSection(notifications, notificationsSteps);
saveUserGuideSection(resetPW, resetPWSteps);
 
setTimeout(function () {
     fs.writeFile('../src/public/UserGuide/UserGuideTitle.md', config.title, function (err) {
        if (err) {
            process.exit(j++);
        } else {
            //Root User Guide
            UserGuide.findRootUserGuideSections(function (err, sections) {
                if (err) {
                    console.log('Could not find any sections of the user guide accessible to root users: ' + err);
                    process.exit(j++);
                } else {
                    var files = [];
                    files.push('../src/public/UserGuide/UserGuideTitle.md'); //User Guide title
                    for (var i in sections) {
                        files.push('../src/public/UserGuide/' + sections[i].id + '.md');
                    }
                    readMultipleFiles(files, 'utf8', function (err, contents) {
                        if (err) {
                            console.log('Could not read the following files: ' + files.toString());
                            console.log(err);
                            process.exit(j++);
                        } else {
                            var data = [];
                            var j = 0;
                            for (var i in contents) {
                                if (i == 0) data[j++] = '#' + contents[i]; //User guide title
                                else {
                                    data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                                    data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
                                }
                            }
                            fs.writeFile('../src/public/UserGuide/Root.md', data.join('\n\n'), function (err) {
                                if (err) {
                                    console.log('Could not update the Root User Guide');
                                    process.exit(j++);
                                } else {
                                    console.log('Root User Guide successfully created');
                                    //Supervisor User Guide
                                    UserGuide.findSupervisorUserGuideSections(function (err, sections) {
                                        if (err) {
                                            console.log('Could not find any sections of the user guide accessible to supervisor users: ' + err);
                                            process.exit(j++);
                                        } else {
                                            var files = [];
                                            files.push('../src/public/UserGuide/UserGuideTitle.md'); //User Guide title
                                            for (var i in sections) {
                                                files.push('../src/public/UserGuide/' + sections[i].id + '.md');
                                            }
                                            readMultipleFiles(files, 'utf8', function (err, contents) {
                                                if (err) {
                                                    console.log('Could not read the following files: ' + files.toString());
                                                    console.log(err);
                                                    process.exit(j++);
                                                } else {
                                                    var data = [];
                                                    var j = 0;
                                                    for (var i in contents) {
                                                        if (i == 0) data[j++] = '#' + contents[i]; //User guide title
                                                        else {
                                                            data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                                                            data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
                                                        }
                                                    }
                                                    fs.writeFile('../src/public/UserGuide/Supervisor.md', data.join('\n\n'), function (err) {
                                                        if (err) {
                                                            console.log('Could not update the Supervisor User Guide');
                                                            process.exit(j++);
                                                        } else {
                                                            console.log('Supervisor User Guide successfully created');
                                                            //Administrator User Guide
                                                            UserGuide.findAdministratorUserGuideSections(function (err, sections) {
                                                                if (err) {
                                                                    console.log('Could not find any sections of the user guide accessible to administrator users: ' + err);
                                                                    process.exit(j++);
                                                                } else {
                                                                    var files = [];
                                                                    files.push('../src/public/UserGuide/UserGuideTitle.md'); //User Guide title
                                                                    for (var i in sections) {
                                                                        files.push('../src/public/UserGuide/' + sections[i].id + '.md');
                                                                    }
                                                                    readMultipleFiles(files, 'utf8', function (err, contents) {
                                                                        if (err) {
                                                                            console.log('Could not read the following files: ' + files.toString());
                                                                            console.log(err);
                                                                            process.exit(j++);
                                                                        } else {
                                                                            var data = [];
                                                                            var j = 0;
                                                                            for (var i in contents) {
                                                                                if (i == 0) data[j++] = '#' + contents[i]; //User guide title

                                                                                else {
                                                                                    data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                                                                                    data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
                                                                                }
                                                                            }
                                                                            fs.writeFile('../src/public/UserGuide/Administrator.md', data.join('\n\n'), function (err) {
                                                                                if (err) {
                                                                                    console.log('Could not update the Administrator User Guide');
                                                                                    process.exit(j++);
                                                                                } else {
                                                                                    console.log('Administrator User Guide successfully created');
                                                                                    //Officer User Guide
                                                                                    UserGuide.findOfficerUserGuideSections(function (err, sections) {
                                                                                        if (err) {
                                                                                            console.log('Could not find any sections of the user guide accessible to officer users: ' + err);
                                                                                            process.exit(j++);
                                                                                        } else {
                                                                                            var files = [];
                                                                                            files.push('../src/public/UserGuide/UserGuideTitle.md'); //User Guide title                                                                                     
                                                                                            for (var i in sections) {
                                                                                                files.push('../src/public/UserGuide/' + sections[i].id + '.md');
                                                                                            }
                                                                                            readMultipleFiles(files, 'utf8', function (err, contents) {
                                                                                                if (err) {
                                                                                                    console.log('Could not read the following files: ' + files.toString());
                                                                                                    console.log(err);
                                                                                                    process.exit(j++);
                                                                                                } else {
                                                                                                    var data = [];
                                                                                                    var j = 0;
                                                                                                    for (var i in contents) {
                                                                                                        if (i == 0) data[j++] = '#' + contents[i]; //User guide title
                                                                                                        else {
                                                                                                            data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                                                                                                            data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
                                                                                                        }
                                                                                                    }
                                                                                                    fs.writeFile('../src/public/UserGuide/Officer.md', data.join('\n\n'), function (err) {
                                                                                                        if (err) {
                                                                                                            console.log('Could not update the Officer User Guide');
                                                                                                            process.exit(j++); 
                                                                                                        } else {
                                                                                                            console.log('Officer User Guide successfully created');
                                                                                                            process.exit(0); 
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }

                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}, 10000);