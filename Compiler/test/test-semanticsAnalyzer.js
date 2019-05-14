var assert = require('assert');
var analyzer = require("../SyntaxAnalyzer")
const lynAnal = require("../lexicalAnalyzer")
var typifier = require('../LexicalIdent')
var Grammers = require('../Grammers')
var fs = require('fs')



describe('handles all semantic actions', function(){
    it('x=y; statement', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t1.kxi')
        Grammers.init();
        Grammers.Statement(lynAnal.GetNextToken(), lynAnal)
        Grammers.pass2 = true;

        lynAnal.Initialize('./testFiles/t1.kxi')
        assert.equal(lynAnal.GetNextToken().Lexeme,"x")
        Grammers.Statement(lynAnal.CurrentToken, lynAnal)
    }),
    it('ipush is executed properly',function(){
        
    })
})
