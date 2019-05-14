sarStack = require('../semSarStack')
sar = require('./semanticActionRecord')

module.exports = function(token)
{
    let record = new sar(token.Lexeme);
    //console.log(name)
    record.sarType = "iPush"
    record.lineNum = token.lineNum
    sarStack.push(record)
    return true
}