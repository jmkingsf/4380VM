sarStack = require('../semSarStack')
sar = require('./semanticActionRecord')
i = require('./iSemanticAction')

module.exports = function(token)
{
    let newSar = new sar()
    newSar.value = token.Lexeme
    newSar.lineNum = token.lineNum
    newSar.type = token.valueType
    newSar.sarType = "lit_sar"
    newSar.symId = i.symT.getSymIdOfToken2(token.Lexeme)

    sarStack.push(newSar)
}