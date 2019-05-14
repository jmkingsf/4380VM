sarStack = require('../../semSarStack')
sar = require('../semanticActionRecord')
i = require("../iSemanticAction")

module.exports = function()
{
    //console.log("fired <")
    let op1 = sarStack.pop();
    let op2 = sarStack.pop();

    // console.log(op1, op2)
    if(op1.type != op2.type)
        i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} != ${op1.type} ${op1.value}`, "")

    i.addTemp(op1, op2, "!=", "bool")

    let newQuad = new i.quad(i.insTypes.notEqual, op2, op1, i.sas.top(), `${op2.value} != ${op1.value}`)
    i.quadProxy.push(newQuad)

}