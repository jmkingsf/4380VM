Identifier = require('./LexicalIdent')
LexAnal = require('./lexicalAnalyzer')
fs = require("fs")
let output = process.stdout

replaced = 0

module.exports = {
    Grammers: require('./Grammers'),
    ProcessDocument: function(){
        this.Grammers.init()
        let exceptionMessage = null
            
        let token = LexAnal.GetNextToken()
        exceptionMessage = this.Grammers.Start(token, LexAnal)
        this.Grammers.SymbolTable.write("symbolTable.txt")
        if(this.Grammers.pass2() == false)
            this.Grammers.pass2(true)
        if(exceptionMessage)
        {
            output.write(exceptionMessage+'\n')
            process.exit()
        }

    },
    SetOutput: function(filename)
    {
        if(filename)
        {
            output = fs.createWriteStream(filename)
        }
    }

}


