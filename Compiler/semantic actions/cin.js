i = require("./iSemanticAction")

module.exports = function(token)
{
    //console.log("fired cin")
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
    if(expr == null || ((expr.type != "int" && expr.type != "char") || expr.sarType == "lit_sar"))
        i.throwError(token.lineNum, `cin not defined for ${type}`, "")

    while(i.sas.top() != null)
    {
        i.sas.pop()
    }
   
    i.quadProxy.push(new i.quad(i.insTypes.read, expr, null, null, `${expr.value}`))

}