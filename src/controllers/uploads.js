/**
 * This class sets the controls for the uploads routes
 */

var fs = require('fs');
var md = require('node-markdown').Markdown;

/**
*Uploads files to img folder.
*/
exports.savingImages = function(req, res) {
  console.log("\nSaving Images Now");
    fs.writeFile(appRoot + '/../public/img/filename', res.body, function(err) {
      if (err) {
        res.send('Something when wrong');
      } else {
        res.send('Saved!');
      }
    })
};
