var LOG_MATCHER = /console.log(?:.(?:call|apply))?\(.*?\);?/g;

function splitLines(content) {
  return content.split('\n');
}

function mapLinesToLineNumber(line, index) {
  return {
    line: line,
    lineNumber: index + 1
  };
}

function collectMatches(lineData) {
  return (lineData.line.match(LOG_MATCHER) || []).map(function(match) {
    return {
      lineNumber: lineData.lineNumber,
      content: match
    };
  });
}

function filterUnmatchedLines(lineMatches, lineMatchData) {
  return lineMatches.concat(lineMatchData);
}

function findAllCalls(content) {
  return splitLines(content)
  .map(mapLinesToLineNumber)
  .map(collectMatches)
  .reduce(filterUnmatchedLines, []);
}

function removeAllCalls(content) {
  return content.replace(LOG_MATCHER, '');
}

module.exports = function(content, options) {
  var removeCalls, foundCalls;
  options = options || {};
  removeCalls = options.remove !== false;

  foundCalls = findAllCalls(content);

  if ( removeCalls ) {
    content = removeAllCalls(content);
  }

  return {
    content: content,
    lines: foundCalls
  };
};
