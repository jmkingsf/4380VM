sarStack = require('../../semSarStack')
sar = require('../semanticActionRecord')
i = require("../iSemanticAction")

module.exports = function()
{
    //console.log("fired &&")
    let op2 = sarStack.pop();
    let op1 = sarStack.pop();


    if(op1 == null)
    {
        op1 = {}
        op1.type = null
    }

    // console.log(op1, op2)
    if(op1.type != op2.type && op1.type != "bool" || op2.type != "bool")
        i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} && ${op1.type} ${op1.value}`, "")
    
    op3 = {}
    op3.symId = i.addTemp(op1, op2, "&&")
    i.quadProxy.push(new i.quad(i.insTypes.and, op2, op1, op3, `${op2.value} && ${op1.value}`))

}