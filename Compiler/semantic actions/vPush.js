sarStack = require('../semSarStack')
sar = require('./semanticActionRecord')
i = require("./iSemanticAction")

module.exports = function(currentToken) {
    //console.log("Fired vPush")
    let record = new sar(currentToken.Lexeme);
    //console.log(name)
    record.type = currentToken.valueType
    if(currentToken.type)
        record.type = currentToken.type
    record.symId = i.symT.getSymIdOfToken2(currentToken.Lexeme)
    record.sarType = "var_push"

    sarStack.push(record)
    return true
}