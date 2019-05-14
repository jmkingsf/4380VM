var assert = require('assert');
var analyzer = require("../lexicalAnalyzer.js")
var ident = require("../LexicalIdent.js")

  // describe('lexical analyzer', function() {
  //   it('should make these tokens', function() {
  //     data = "'\n'whatif(a<b;-10++373,if'a'"
  //     actualTokens= analyzer.MakeTokensFromData(data)
  //     assert.equal(actualTokens,["'\n'", "whatif", "(", "a", "<", "b", ";", "-", "10", "+", "+", "373", ",", "if","'a'"]);
  //   });
  // });

  describe('identifies these types', function() {
    it('should identify a comment', function() {
      current = "\\this is a beautiful comment"

    })

    it(" 'abc' is unknown", function() {
      
    })

    it(" \"'a'\" is unknown", function() {
      
    })
  })