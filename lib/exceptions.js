/*!
 * LogExceptions
 * Copyright(c) 2015 Ryan Scott Norman
 * MIT Licensed
 */

'use strict';

var fs = require('fs');
var Promise = require('bluebird');
var path = require('path');
Promise.promisifyAll(fs);

function LogExceptions(exceptionFilename) {

  function getResourceFileExceptionData(resourceFile, resourceData) {
    return resourceFile.indexOf(path.resolve(resourceData.filename)) !== -1;
  }

  function getSkipLineNumbers(resourceData) {
    return resourceData.lines;
  }

  this.forResource = function(resourceFilename) {
    var exceptionData, exceptions;

    try {
      fs.accessSync(exceptionFilename, fs.R_OK | fs.W_OK);
    } catch(_e) {
      return [];
    }

    exceptionData = fs.readFileSync(exceptionFilename, 'utf8');
    exceptions = JSON.parse(exceptionData);

    return exceptions
    .filter(function(resourceData) {
      return getResourceFileExceptionData(resourceFilename, resourceData);
    })
    .map(getSkipLineNumbers)
    .reduce(function(lines, lineNumbers) {
      return lines.concat(lineNumbers);
    }, []);
  };

  this.forResourceAsync = function(resourceFilename, callback) {
   return new Promise(function(resolve, reject) {
      fs.accessAsync(exceptionFilename, fs.R_OK | fs.W_OK).then(function() {
        fs.readFileAsync(exceptionFilename, 'utf8').then(function(exceptionData) {
          var exceptions;
          exceptions = JSON.parse(exceptionData);

          resolve(
            exceptions
            .filter(function(resourceData) {
              return getResourceFileExceptionData(resourceFilename, resourceData);
            })
            .map(getSkipLineNumbers)
            .reduce(function(lines, lineNumbers) {
              return lines.concat(lineNumbers);
            }, [])
          );
        }).catch(function(error) {
          reject('Could not read file');
        });
      }).catch(function(error) {
        resolve([]);
      });
    });
  };
};

module.exports = LogExceptions;
