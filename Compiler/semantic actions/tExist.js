i = require("./iSemanticAction")

module.exports = function(token)
{
    // console.log("fire tExist")
    // console.log(token)
    let type_sar = i.sas.pop()
    //check if the type/class exists. So I can just look at the global scope
    let syms = i.symT.getSymsAtScope("g")
    let found = false;
    // console.log(syms)
    syms.forEach(item => {
        if(item.value == type_sar.value)
        {
            found = true;
            return
        }
    })
    if(!found)
        i.throwError(token.lineNum, `type ${token.Lexeme}`, "not defined")

    return found
}