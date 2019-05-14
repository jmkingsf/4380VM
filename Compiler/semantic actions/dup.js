i = require("./iSemanticAction")

module.exports = function(args)
{
    //checks if current scope contains duplicates
    //how do we get the current scope?
    //I think Iexist should append scope if necessary

    //
    //console.log(args)
    let token = args[0]
    let type = args[1]
    let errorType = args[2]
    

    let symsAtCurrentScope = i.symT.getSymsAtScope()
    let found = false;
    // console.log("fired dup")
    // console.log(token, type, errorType)
    // console.log(symsAtCurrentScope)
    // console.log()
    // I may need to check for type as well

    //Error is thrown if:
    /*
    - variable with same name and type exists at the current scope
    */
   symsAtCurrentScope.forEach((item)=> {
        if(isMatch(token.Lexeme, type, item) && found == item.scope)
            i.throwError(token.lineNum, `duplicate ${errorType} ${token.Lexeme}`, "found")

        if(isMatch(token.Lexeme, type, item))
            found = item.scope;
        
    })

}

function isMatch(name, type, sym)
{
    return sym.value == name && sym.kind != "temp"
}