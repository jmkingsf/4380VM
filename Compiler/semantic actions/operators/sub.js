i = require("../iSemanticAction")

module.exports = function()
{
    let op1 = i.sas.pop();
    let op2 = i.sas.pop();

    if(op1.type != op2.type || op1.type != "int" )
    {
        throw i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} - ${op1.type} ${op1.value}`, "")
    }

    i.addTemp(op1, op2, "-" )
    i.quadProxy.push(new i.quad(i.insTypes.sub,op2, op1, i.sas.top(), `${op2.value} - ${op1.value}`))

}