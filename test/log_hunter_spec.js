var should = require('should');
var logHunterLoader = require('..');

describe('logHunterLoader', function() {
  describe('with no "console.log" statements', function() {
    it('does not modify content', function() {
      var result = logHunterLoader.call({}, 'function() {}');
      result.should.equal('function() {}');
    });
  });

  describe('with "console.log" statement', function() {
    describe('with semicolon', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunterLoader.call({}, 'function() {console.log(\'here\');}');
        result.should.equal('function() {}');
      });
    });

    describe('without semicolon', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunterLoader.call({}, 'function() {console.log(\'here\')}');
        result.should.equal('function() {}');
      });
    });

    describe('with call', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunterLoader.call({}, 'function() {console.log.call(console, \'here\')}');
        result.should.equal('function() {}');
      });
    });

    describe('with apply', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunterLoader.call({}, 'function() {console.log.apply(console, [\'here\'])}');
        result.should.equal('function() {}');
      });
    });
  });
});
