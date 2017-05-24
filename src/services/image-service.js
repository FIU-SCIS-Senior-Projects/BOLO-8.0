/* jshint node: true */
module.exports = ImageService;
'use strict';

var _ = require('lodash');
var Promise = require('promise');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var path = require('path');
var jimp = require('jimp');
var config = require('../config');

function ImageService() {}

ImageService.prototype.createImageFromBuffer = function(file) {

  console.log('copying image');
  // A buffer can be passed instead of a filepath as well
  if (!file.content_type)
    throw new Error('no file content specified');

  var img_type = file.content_type.substring(file.content_type.lastIndexOf("/") + 1);

  if (img_type === 'jpeg')
    img_type = 'jpg';

  var img_buffer = file.data;

  gm(img_buffer).write('C:/Users/Ed/WebstormProjects/BOLO4-Dev/Code/src/core/Images/' + file.name + '.' + img_type, function(err) {
    if (!err)
      console.log('done');
    else
      console.log(err);
    }
  );

};

ImageService.prototype.compressImageFromBuffer = function(attDTOs) {

  if (!attDTOs.data) {
    throw new Error('Invalid Image Data');
  }

  var img_type = attDTOs.content_type.substring(attDTOs.content_type.lastIndexOf("/") + 1);

  return convertToJpg(attDTOs, img_type).then(function(content) {

    attDTOs.data = content;

    var img_size = attDTOs.data.length;

    var compression_level = config.const.LOW_COMPRESSION;

    if (img_size <= 1024000) {
      console.log('applying low compression');
      compression_level = config.const.LOW_COMPRESSION;
    } else if (img_size > 1024000 && img_size <= 2048000) {
      console.log('applying medium compression');
      compression_level = config.const.MEDIUM_COMPRESSION;
    } else if (img_size > 2048000) {
      console.log('applying high compression');
      compression_level = config.const.HIGH_COMPRESSION;
    } else {
      compression_level = config.const.LOW_COMPRESSION;
    }

    return compress(attDTOs, compression_level).then(function(content) {
      attDTOs.data = content;
      return attDTOs;

    });

  });

};

ImageService.prototype.compressImageFromBufferOutToFile = function(file) {

  // A buffer can be passed instead of a filepath as well
  if (!file.content_type)
    throw new Error('no file content specified');

  var img_type = file.content_type.substring(file.content_type.lastIndexOf("/") + 1);
  console.log(img_type);

  var compression = img_type.toUpperCase();
  if (img_type === 'jpeg')
    img_type = 'jpg';

  var img_buffer = file.data;
  var img_name = file.name;

  jimp.read(img_buffer, function(err, img) {
    if (err)
      throw err;
    img.quality(compression_level).write("picture.jpg");

  });

};

var convertToJpg = function(file, img_type) {

  console.log(img_type);
  if ((img_type.localeCompare('jpg') === 0) || (img_type.localeCompare('jpeg') === 0)) {
    console.log('Already a jpeg');
    return Promise.resolve(file.data);
  } else {
    var img_buffer = file.data;
    var img_name = file.name;
    return new Promise(function(resolve, reject) {
      gm(img_buffer, img_name + '.' + img_type).toBuffer('JPEG', function(err, buffer) {
        if (err) {
          console.log(err);
          reject(new Error(err));
        } else {
          console.log("Successfuly converted to JPEG, new length: " + buffer.length);
          resolve(buffer);
        }

      });
    });

  }
};
var compress = function(file, compression_level) {

  return new Promise(function(resolve, reject) {
    console.log('comp level' + compression_level);

    console.log('compressing');
    // A buffer can be passed instead of a filepath as well
    if (!file.content_type)
      throw new Error('no file content specified');

    var img_type = file.content_type.substring(file.content_type.lastIndexOf("/") + 1);
    console.log(img_type);
    var compression = 'JPEG';
    var img_buffer = file.data;
    var img_name = file.name;
    console.log("original image length is " + img_buffer.length + " for image: " + img_name);
    console.log('ready to call jimp');

    jimp.read(img_buffer, function(err, img) {
      if (err)
        throw err;
      img.resize(650, jimp.AUTO).quality(compression_level).getBuffer(jimp.MIME_PNG, function(err, buffer) {
        if (err) {
          console.log(err);
          reject(new Error(err));
        } else {
          console.log("Successfuly compressed...Image now has a size of: " + buffer.length);
          resolve(buffer);
        }
      });
    }).then(function(testbuffer) {
      console.log(testbuffer);
      resolve(testbuffer);
    }).catch(function(err) {
      console.log(err)

    });

  });
};
