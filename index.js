var LOG_MATCHER = /console.log(?:.(?:call|apply))?\(.*?\);?/g;

function findAllCalls(content) {
  var _i, _len, lines, matches, foundCalls;
  foundCalls = [];
  lines = content.split('\n');

  for ( _i = 0, _len = lines.length; _i < _len; _i++ ) {
    if ( matches = lines[_i].match(LOG_MATCHER) ) {
      foundCalls = foundCalls.concat(matches.map(function(match) {
        return {
          lineNumber: _i + 1,
          content: match
        };
      }));
    }
  }

  return foundCalls;
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
