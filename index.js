module.exports = function(content) {
  var LOG_MATCHER = /console.log(.(call|apply))?\(.*\)(;)?/g;
  content = content.replace(LOG_MATCHER, '');
  return content;
};
