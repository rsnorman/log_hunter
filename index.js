/*!
 * LogHunterLoader
 * Copyright(c) 2015 Ryan Scott Norman
 * MIT Licensed
 */

'use strict';

var LogHunter = require('./lib/log_hunter');
var loaderUtils = require('loader-utils');

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
    return msg + '  `' + occurrence.content + '` on line ' + occurrence.lineNumber + '\n';
  }, message);
}

/**
 * Loader for finding and/or removing "console.log" statements
 *
 * @param {String} content with potential "console.log" statements
 * @return {String} original content with or without "console.log" statements
 */
function LogHunterLoader(content) {
  var config, logMatchResults, emitter;
  config = loaderUtils.parseQuery(this.query);

  logMatchResults = new LogHunter(content, !!config.remove);

  emitter = config.emitError ? this.emitError : this.emitWarning;

  if ( !!emitter && logMatchResults.occurrences.length > 0 ) {
    emitter(createWarningMessage(logMatchResults.occurrences));
  }

  return logMatchResults.content;
}

module.exports = LogHunterLoader;
