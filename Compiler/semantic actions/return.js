i = require("./iSemanticAction")
hasReturn = false

module.exports = function(type)
{
    if(!hasReturn) {
        //console.log("fired return")
        let operator = i.sos.pop()
        while(operator != null)
        {
            //console.log(operator)
        
            operator.eval()
            operator = i.sos.pop()
        }
        //if exists at current Scope 

        let expr = i.sas.pop()
        let funcSym = i.symT.getCurrentScopeToken()

        //I need to get the return type of the function I am returning from
        if(expr != null && expr.type != funcSym.data.type)
            i.throwError(expr.lineNum, "Function requires", `${funcSym.data.type} returned ${expr.type}`)

        while(i.sas.top() != null)
        {
            i.sas.pop()
        }

        let comment = ""
        let instruction;
        if(!expr)
        {
            instruction = i.insTypes.rtn
        }else {
            instruction = i.insTypes.return
            comment = expr.value
        }

        if(type == "constructor")
            expr = "constructor"
        if(type == "func" && !expr)
        {
            instruction = i.insTypes.rtn
            expr = "func"
        }


        i.quadProxy.push(new i.quad(instruction, expr, funcSym.value, null, `${comment}`))
        hasReturn = true
    }
    hasReturn = false
}