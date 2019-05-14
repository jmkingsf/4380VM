var assert = require('assert');
var analyzer = require("../SyntaxAnalyzer")
const lynAnal = require("../lexicalAnalyzer")
var typifier = require('../LexicalIdent')
var Grammers = require('../Grammers')
var fs = require('fs')

describe('Process a statement', function(){
    it('x=y; statement', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t1.kxi')
        Grammers.init();

        assert.equal(Grammers.Statement(lynAnal.GetNextToken(), lynAnal), null)
    })
    it('x = y + k - i < k;', function() {
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t2.kxi')
        assert.equal(Grammers.Statement(lynAnal.GetNextToken(), lynAnal))
    })
})

describe("insert into symbol table", function(){
    it('class cat{}', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t3.kxi')
        Grammers.init();

        assert.equal(Grammers.Class(lynAnal.GetNextToken(), lynAnal), null)
        assert.ok(Grammers.SymbolTable.table["c100"])
        assert.equal(Grammers.SymbolTable.scopeStack.length, 1)
    })
    it('class cat{with var}', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t4.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Class(lynAnal.GetNextToken(), lynAnal), null)
        assert.ok(Grammers.SymbolTable.table["c100"])
        assert.equal(Grammers.SymbolTable.table["c100"].scope, "g")
        assert.ok(Grammers.SymbolTable.table["i101"])
        assert.ok(Grammers.SymbolTable.table["i102"])
        assert.equal(Grammers.SymbolTable.scopeStack.length, 1)
    })
    it('class cat{with function}', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t5.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Class(lynAnal.GetNextToken(), lynAnal), null)
        assert.ok(Grammers.SymbolTable.table["c100"])
        assert.ok(Grammers.SymbolTable.table["p101"])
        assert.equal(Grammers.SymbolTable.table["m103"].value, "run")
        assert.ok(Grammers.SymbolTable.table["p102"])
        assert.equal(Grammers.SymbolTable.table["p102"].scope, "g.Cat.run")
        assert.ok(Grammers.SymbolTable.table["l104"])
        assert.ok(Grammers.SymbolTable.table["l105"])

        assert.equal(Grammers.SymbolTable.table["i106"].scope, "g.Cat")

        assert.equal(Grammers.SymbolTable.scopeStack.length, 1)
    })
    it('a class and a main', function()
    {
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t6.kxi')
        Grammers.SymbolTable.reset()
        Grammers.init();

        assert.equal(Grammers.Start(lynAnal.GetNextToken(), lynAnal), null)
        Grammers.SymbolTable.write("symbolTable.txt")
        assert.ok(Grammers.SymbolTable.table["c100"])
        assert.ok(Grammers.SymbolTable.table["m105"])
        assert.ok(Grammers.SymbolTable.table["i108"])
        assert.ok(Grammers.SymbolTable.table["x109"])
        assert.ok(Grammers.SymbolTable.table["f110"])
        
    }),
    it('nested ifs', function()
    {
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t7.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Start(lynAnal.GetNextToken(), lynAnal), null)
        Grammers.SymbolTable.write("symbolTable.txt")
        
        
    })
    it('every item in the symboltable', function() {
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t9.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Start(lynAnal.GetNextToken(), lynAnal), null)

        assert.ok(Grammers.SymbolTable.table["c100"])
        assert.ok(Grammers.SymbolTable.table["i101"])
        assert.ok(Grammers.SymbolTable.table["i102"])
        assert.ok(Grammers.SymbolTable.table["m104"])
        assert.ok(Grammers.SymbolTable.table["p103"])
        assert.ok(Grammers.SymbolTable.table["i105"])
        assert.ok(Grammers.SymbolTable.table["c106"])
        assert.ok(Grammers.SymbolTable.table["f107"])
        assert.ok(Grammers.SymbolTable.table["l108"])
        Grammers.SymbolTable.write("symbolTable.txt")
    })
    it('nested ifs', function() {
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t8F.kxi')
        Grammers.SymbolTable.reset()

        let exception = Grammers.Start(lynAnal.GetNextToken(), lynAnal)
        Grammers.SymbolTable.write("symbolTable.txt")

        assert.equal(exception, null)
    })
})

describe('handles every possible part of the grammer', function(){
    it('handles itoa and atoa', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/t10.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Start(lynAnal.GetNextToken(), lynAnal), null)
    })
    it('handles all types of expressions', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/allExpressions.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Start(lynAnal.GetNextToken(), lynAnal), null)
    })

    it('handles all statements', function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/allStatements.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Start(lynAnal.GetNextToken(), lynAnal), null)
    })

    it('handles arguement lists', function() {
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/argumentList.kxi')
        Grammers.SymbolTable.reset()

        assert.equal(Grammers.Start(lynAnal.GetNextToken(), lynAnal), null)
    })
})

describe('outputs errors', function() {
    it("outputs an error for a missing semicolon", function(){
        Grammers.init();
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/missingSemicolon.kxi')
        Grammers.SymbolTable.reset()

        let exception = Grammers.Start(lynAnal.GetNextToken(), lynAnal)

        assert.equal(exception, "<line #5> found } expecting ;")
    })

    it("outputs an error for a invalid parameter in constructor", function(){
        const lynAnal = require("../lexicalAnalyzer")
        lynAnal.Initialize('./testFiles/invalidParameterConstructor.kxi')
        Grammers.SymbolTable.reset()

        let exception = Grammers.Start(lynAnal.GetNextToken(), lynAnal)

        assert.equal(exception, "<line #2> found ) expecting identifer")
    })

    
})


