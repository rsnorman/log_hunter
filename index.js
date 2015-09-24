/*!
 * LogMapperLoader
 * Copyright(c) 2015 Ryan Scott Norman
 * MIT Licensed
 */

'use strict';

var logMapper = require('./lib/mapper');
var LogExceptions = require('./lib/exceptions');
var path = require('path');
var loaderUtils = require('loader-utils');

var EXCEPTIONS_PATH = path.resolve('./log-exceptions.json');

/**
 * Creates a warning message for all "console.log" occurrences
 *
 * @param {Array} logOccurrences that appear in content
 * @return {String} message with all "console.log" occurrences
 */
function createWarningMessage(logOccurrences) {
  var message;

  message = 'Found ' + logOccurrences.length + ' "console.log" statements\n'

  return logOccurrences.reduce(function(msg, occurrence) {
    return msg + '  "' + occurrence.content + '" on line ' + occurrence.lineNumber + '\n';
  }, message);
}

function removeExceptions(logOccurrences, exceptions) {
  return logOccurrences.filter(function(occurrence) {
    return exceptions.indexOf(occurrence.lineNumber) === -1;
  })
}

function getLogOccurrencesSync(content, exceptionFile) {
  var skipLines, logExceptions, logOccurrences;

  if (exceptionFile) {
    logExceptions = new LogExceptions(exceptionFile);
    skipLines = logExceptions.forResource(this.resource);
  } else {
    skipLines = [];
  }

  logOccurrences = logMapper(content);
  return removeExceptions(logOccurrences, skipLines);
}

function getLogOccurrences(content, exceptionFile, callback) {
  var skipLines, logExceptions, logOccurrences;

  if (callback) {
    logOccurrences = logMapper(content);

    if (exceptionFile) {
      logExceptions = new LogExceptions(exceptionFile);
      logExceptions.forResourceAsync(this.resource).then(function(skipLines) {
        callback(null, removeExceptions(logOccurrences, skipLines));
      });
    } else {
      callback(null, logOccurrences);
    }
  } else {
    return getLogOccurrencesSync.call(this, content, exceptionFile);
  }
}

function commentContent(content, message) {
  var commentWarning;
  commentWarning = message.split('\n').map(function(line) {
    return '// ' + line;
  }).join('\n');

  return commentWarning + '\n\n' + content;
}

function LogHunterLoader(content) {
  var logOccurrences, warningMessage, emitter, config, callback;

  this.cacheable && this.cacheable();

  config = loaderUtils.parseQuery(this.query);

  emitter = config.emitError ? this.emitError : this.emitWarning;

  this.addDependency(EXCEPTIONS_PATH);

  callback = this.async();

  if (callback) {
    getLogOccurrences.call(this, content, EXCEPTIONS_PATH, function(err, logOccurrences) {
      warningMessage = createWarningMessage(logOccurrences);

      if (logOccurrences.length > 0) {
        emitter && emitter(warningMessage);

        callback(null, commentContent(content, warningMessage));
      } else {
        callback(null, content);
      }
    });
  } else {
    logOccurrences = getLogOccurrences.call(this, content, EXCEPTIONS_PATH);

    warningMessage = createWarningMessage(logOccurrences);

    if (logOccurrences.length > 0) {
      emitter && emitter(warningMessage);

      return commentContent(content, warningMessage);
    } else {
      return content;
    }
  }
}

module.exports = LogHunterLoader;
