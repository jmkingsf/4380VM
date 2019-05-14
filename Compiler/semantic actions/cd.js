i = require("./iSemanticAction")

module.exports = function(identToken)
{
    let cScope = i.symT.getScope()
    if(!cScope.includes(identToken.Lexeme))
    {
        i.throwError(identToken.linenum, `Constructor ${ident.Lexeme} must match class name ${cScope.split('.').pop()}`, "")
       // <line_number> ": Constructor " <lexeme> " must match class name " <lexeme>
    }
}