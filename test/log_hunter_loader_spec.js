var should = require('should');
var sinon = require('sinon');
var logHunterLoader = require('..');

describe('logHunterLoader', function() {
  var content;
  content = 'function() {\n\
              var i = 0; \n\
              console.log(\'before: \', i);\n\
              i++; \n\
              console.log(\'after: \', i);\n\
            }';

  describe('with out removing "console.log" calls', function() {
    it('returns original content', function() {
      logHunterLoader.call({}, content).should.equal(content);
    });
  });

  describe('with removing "console.log" calls', function() {
    var modifiedContent;
    modifiedContent = 'function() {\n\
              var i = 0; \n\
              \n\
              i++; \n\
              \n\
            }';

    it('returns content with removed "console.log" calls', function() {
      logHunterLoader.call({
        query: '?remove=true'
      }, content).should.equal(modifiedContent);
    });
  });

  describe('with no "console.log" occurrences', function() {
    it('emits no warning', function() {
      var emitWarningSpy;
      emitWarningSpy = sinon.spy();
      logHunterLoader.call({
        emitWarning: emitWarningSpy
      }, 'function() {}');
      emitWarningSpy.called.should.equal(false);
    });
  });

  describe('with not having emit error', function() {
    it('emits warning about "console.log" occurrences', function() {
      var emitWarningSpy;
      emitWarningSpy = sinon.spy();

      logHunterLoader.call({
        emitWarning: emitWarningSpy
      }, content);

      sinon.assert.calledWith(
        emitWarningSpy,
        'Found 2 "console.log" statements\n\
  `console.log(\'before: \', i);` on line 3\n\
  `console.log(\'after: \', i);` on line 5\n'
      );
    });
  });

  describe('with having emit error', function() {
    it('emits error about "console.log" occurrences', function() {
      var emitErrorSpy;
      emitErrorSpy = sinon.spy();
      logHunterLoader.call({
        emitError: emitErrorSpy,
        query: '?emitError=true'
      }, content);

      sinon.assert.calledWith(
        emitErrorSpy,
        'Found 2 "console.log" statements\n\
  `console.log(\'before: \', i);` on line 3\n\
  `console.log(\'after: \', i);` on line 5\n'
      );
    });
  });
});
