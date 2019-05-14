sarStack = require('../../semSarStack')
sar = require('../semanticActionRecord')
i = require("../iSemanticAction")

module.exports = function()
{
    // console.log("fired =")
    let op1 = sarStack.pop();
    let op2 = sarStack.pop();

    // console.log(op1, op2)
    // if(op2.value == op2.type)
    //     i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} = ${op1.type} ${op1.value}`, "")

    // if(op1.value == op1.type)
    //     i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} = ${op1.type} this`, "")


    if(i.mathSafe(op2, op1))
    {
        if(op1.value == op1.type)
        {
            op1.value = op1.type
            if(op1.symId[0] != "t")
                op1.value = "this"
            
            if(op2.value == "null")
                op2.type = "null"
        }
        i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} = ${op1.type} ${op1.value}`, "")
    }

    i.quadProxy.push(new i.quad(i.insTypes.mov,op1, op2, null, `${op2.value} = ${op1.value}`))
}