i = require("./iSemanticAction")

module.exports = function(token)
{
    let className = i.symT.getScope().split('.').pop()
    if(token.Lexeme != className)
        i.throwError(token.lineNum, `constructor ${token.Lexeme} must match class name ${className}`, ``)

}
