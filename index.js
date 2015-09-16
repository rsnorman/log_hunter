/*!
 * LogHunter
 * Copyright(c) 2015 Ryan Scott Norman
 * MIT Licensed
 */

'use strict';

var LOG_MATCHER = /console.log(?:.(?:call|apply))?\(.*?\);?/g;

/**
 * Splits content on line breaks
 *
 * @param {String} content that will be split on new lines
 * @return {Array} of lines from content
 */
function splitLines(content) {
  return content.split('\n');
}

/**
 * Creates an object with line content and number
 *
 * @param {String} line that contains content
 * @param {Number} index of the line
 * @return {Object} with line content and number
 */
function mapLineToLineNumber(line, index) {
  return {
    line: line,
    lineNumber: index + 1
  };
}

/**
 * Finds all the "console.log" calls in the line content
 *
 * @param {Object} lineData contains line content and number
 * @return {Array} of matches and the line number they occured on
 */
function findLogMatches(lineData) {
  return (lineData.line.match(LOG_MATCHER) || []).map(function(match) {
    return {
      lineNumber: lineData.lineNumber,
      content: match
    };
  });
}

/**
 * Flattens all line matches into one array
 *
 * @param {Array} lineMatches array of all collected matches
 * @param {Array} matches from a single line of content
 * @return {Array} of concatenated matches from lines of content
 */
function flattenMatchedLines(lineMatches, lineMatchData) {
  return lineMatches.concat(lineMatchData);
}

/**
 * Finds all the "console.log" calls
 *
 * @param {String} content that may contain "console.log" calls
 * @return {Array} array of all "console.log" calls and their respective line numbers
 */
function findAllCalls(content) {
  return splitLines(content)
  .map(mapLineToLineNumber)
  .map(findLogMatches)
  .reduce(flattenMatchedLines, []);
}

/**
 * Removes all "console.log" calls
 *
 * @param {String} content that will have "console.log" calls removed
 * @return {String} content with all "console.log" calls removed
 */
function removeAllCalls(content) {
  return content.replace(LOG_MATCHER, '');
}

/**
 * Finds all the "console.log" calls in a string of content
 *
 * @param {String} content content that may contain "console.log" calls
 * @param {Bool} removeCalls flag whether or not to remove calls
 * @return {Object} containing content and where "console.log" calls occurred
 */
function LogHunter(content, removeCalls) {
  var removeCalls, foundCalls;
  removeCalls = removeCalls !== false;

  foundCalls = findAllCalls(content);

  if ( removeCalls ) {
    content = removeAllCalls(content);
  }

  return {
    content: content,
    lines: foundCalls
  };
};

module.exports = LogHunter;
