var should = require('should');
var logHunter = require('../lib/log_hunter');

describe('logHunter', function() {
  describe('with no "console.log" statements', function() {
    it('does not modify content', function() {
      var result = logHunter('function() {}');
      result.content.should.equal('function() {}');
    });
  });

  describe('with "console.log" statement', function() {
    describe('with semicolon', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunter(
          'function() {console.log(\'here\');}'
        );
        result.content.should.equal('function() {}');
      });
    });

    describe('without semicolon', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunter(
          'function() {console.log(\'here\')}'
        );
        result.content.should.equal('function() {}');
      });
    });

    describe('with call', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunter(
          'function() {console.log.call(console, \'here\')}'
        );
        result.content.should.equal('function() {}');
      });
    });

    describe('with apply', function() {
      it('removes the "console.log" statement', function() {
        var result = logHunter(
          'function() {console.log.apply(console, [\'here\'])}'
        );
        result.content.should.equal('function() {}');
      });
    });

    describe('without remove option', function() {
      it('does not remove the "console.log" statement', function() {
        var result = logHunter(
          'function() {console.log(\'here\');}',
          false
        );
        result.content.should.equal('function() {console.log(\'here\');}');
      });
    });

    describe('result on found "console.log" call lines', function() {
      describe('with one "console.log" statement', function() {
        var result;
        beforeEach(function() {
          result = logHunter(
            'function() {console.log(\'here\');}'
          );
        });

        it('returns position of only "console.log" statement', function() {
          result.occurrences[0].lineNumber.should.equal(1);
        });

        it('returns text of only "console.log" statement', function() {
          result.occurrences[0].content.should.equal('console.log(\'here\');');
        });
      });

      describe('with multiple "console.log" statements', function() {
        var result;
        beforeEach(function() {
          result = logHunter(
            'function() {\n\
              var i = 0; \n\
              console.log(\'before: \', i);\n\
              i++; \n\
              console.log(\'after: \', i);\n\
            }'
          );
        });

        it('returns position of first "console.log" statement', function() {
          result.occurrences[0].lineNumber.should.equal(3);
        });

        it('returns text of first "console.log" statement', function() {
          result.occurrences[0].content.should.equal('console.log(\'before: \', i);');
        });

        it('returns position of second "console.log" statement', function() {
          result.occurrences[1].lineNumber.should.equal(5);
        });

        it('returns text of second "console.log" statement', function() {
          result.occurrences[1].content.should.equal('console.log(\'after: \', i);');
        });
      });

      describe('with multiple "console.log" statements on one line', function() {
        var result;
        beforeEach(function() {
          result = logHunter(
            'function() {\
              var i = 0;\
              console.log(\'before: \', i);\
              i++;\
              console.log(\'after: \', i);\
            }'
          );
        });

        it('returns position of first "console.log" statement', function() {
          result.occurrences[0].lineNumber.should.equal(1);
        });

        it('returns text of first "console.log" statement', function() {
          result.occurrences[0].content.should.equal('console.log(\'before: \', i);');
        });

        it('returns position of second "console.log" statement', function() {
          result.occurrences[1].lineNumber.should.equal(1);
        });

        it('returns text of second "console.log" statement', function() {
          result.occurrences[1].content.should.equal('console.log(\'after: \', i);');
        });
      });
    });
  });
});
