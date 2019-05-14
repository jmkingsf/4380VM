i = require("./iSemanticAction")

module.exports = function(token)
{
    //console.log("fired cout")
    let operator = i.sos.pop()
    while(operator != null)
    {
        //console.log(operator)
    
        operator.eval()
        operator = i.sos.pop()
    }
    //if exists at current Scope 

    let expr = i.sas.pop()

    let type = "no value"
    if(expr)
        type = expr.type
    //I need to get the return type of the function I am returning from
    if(expr == null || (expr.type != "int" && expr.type != "char"))
        i.throwError(token.lineNum, `cout not defined for ${type}`, "")

    while(i.sas.top() != null)
    {
        i.sas.pop()
    }
   
    i.quadProxy.push(new i.quad(i.insTypes.write, expr, null, null, `${expr.value}`))
}