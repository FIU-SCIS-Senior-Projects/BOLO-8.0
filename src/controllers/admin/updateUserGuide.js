var fs = require('fs');
var readMultipleFiles = require('read-multiple-files');
var UserGuide = require('../../models/userguide');

/* This method is used to update each of the following User Guides:
   Root, Administrator, Supervisor, Officer */

exports.updateUserGuide = function(OFFICER, SUPERVISOR, ADMINISTRATOR, ROOT) {

  if (ROOT) {
    UserGuide.findRootUserGuideSections(function(err, sections) {
      if (err) {
        console.log('Could not find any sections of the user guide accessible to root users: ' + err);
      } else {
        var files = [];
        files.push(appRoot + '/public/UserGuide/UserGuideTitle.md'); //User Guide title

        //User Guide sections
        for (var i in sections) {
          files.push(appRoot + '/public/UserGuide/' + sections[i].id + '.md');
        }
        readMultipleFiles(files, 'utf8', function(err, contents) {
          if (err) {
            console.log('Could not read the following files: ' + files.toString());
            console.log(err);
          } else {
            var data = [];
            var j = 0;

            for (var i in contents) {

              if (i == 0)
                data[j++] = '#' + contents[i]; //User guide title

              else {
                data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
              }
            }

            fs.writeFile(appRoot + '/public/UserGuide/Root.md', data.join('\n\n'), function(err) {
              if (err) {
                console.log('Could not update the Root User Guide');
              } else {
                console.log('Root User Guide successfully updated');
              }
            });
          }
        });
      }
    });
  }

  if (SUPERVISOR) {
    UserGuide.findSupervisorUserGuideSections(function(err, sections) {
      if (err) {
        console.log('Could not find any sections of the user guide accessible to supervisor users: ' + err);
      } else {
        var files = [];
        files.push(appRoot + '/public/UserGuide/UserGuideTitle.md'); //User Guide title

        //User Guide sections
        for (var i in sections) {
          files.push(appRoot + '/public/UserGuide/' + sections[i].id + '.md');
        }
        readMultipleFiles(files, 'utf8', function(err, contents) {
          if (err) {
            console.log('Could not read the following files: ' + files.toString());
            console.log(err);
          } else {
            var data = [];
            var j = 0;

            for (var i in contents) {

              if (i == 0)
                data[j++] = '#' + contents[i]; //User guide title

else {
                data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
              }
            }

            fs.writeFile(appRoot + '/public/UserGuide/Supervisor.md', data.join('\n\n'), function(err) {
              if (err) {
                console.log('Could not update the Supervisor User Guide');
              } else {
                console.log('Supervisor User Guide successfully updated');
              }
            });
          }
        });
      }
    });
  }

  if (ADMINISTRATOR) {
    UserGuide.findAdministratorUserGuideSections(function(err, sections) {
      if (err) {
        console.log('Could not find any sections of the user guide accessible to administrator users: ' + err);
      } else {
        var files = [];
        files.push(appRoot + '/public/UserGuide/UserGuideTitle.md'); //User Guide title

        //User Guide sections
        for (var i in sections) {
          files.push(appRoot + '/public/UserGuide/' + sections[i].id + '.md');
        }
        readMultipleFiles(files, 'utf8', function(err, contents) {
          if (err) {
            console.log('Could not read the following files: ' + files.toString());
            console.log(err);
          } else {
            var data = [];
            var j = 0;

            for (var i in contents) {

              if (i == 0)
                data[j++] = '#' + contents[i]; //User guide title

else {
                data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
              }
            }

            fs.writeFile(appRoot + '/public/UserGuide/Administrator.md', data.join('\n\n'), function(err) {
              if (err) {
                console.log('Could not update the Administrator User Guide');
              } else {
                console.log('Administrator User Guide successfully updated');
              }
            });
          }
        });
      }
    });
  }

  if (OFFICER) {
    UserGuide.findOfficerUserGuideSections(function(err, sections) {
      if (err) {
        console.log('Could not find any sections of the user guide accessible to officer users: ' + err);
      } else {
        var files = [];
        files.push(appRoot + '/public/UserGuide/UserGuideTitle.md'); //User Guide title

        //User Guide sections
        for (var i in sections) {
          files.push(appRoot + '/public/UserGuide/' + sections[i].id + '.md');
        }
        readMultipleFiles(files, 'utf8', function(err, contents) {
          if (err) {
            console.log('Could not read the following files: ' + files.toString());
            console.log(err);
          } else {
            var data = [];
            var j = 0;

            for (var i in contents) {

              if (i == 0)
                data[j++] = '#' + contents[i]; //User guide title

              else {
                data[j++] = '###<b>' + sections[i - 1].title + '</b>'; //section title
                data[j++] = '<pre><code>' + contents[i] + '</pre></code>'; //instructions
              }
            }

            fs.writeFile(appRoot + '/public/UserGuide/Officer.md', data.join('\n\n'), function(err) {
              if (err) {
                console.log('Could not update the Officer User Guide');
              } else {
                console.log('Officer User Guide successfully updated');
              }
            });
          }
        });
      }
    });
  }
};
