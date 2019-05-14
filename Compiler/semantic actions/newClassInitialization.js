i = require("./iSemanticAction")

module.exports = function(token)
{   
    i.quadProxy.sQuadArray.changeKey(token.Lexeme)
}