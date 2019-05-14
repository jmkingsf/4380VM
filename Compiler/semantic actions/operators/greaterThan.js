sarStack = require('../../semSarStack')
sar = require('../semanticActionRecord')
i = require("../iSemanticAction")
ibool = require("../../iCode/ibool")


module.exports = function()
{
    //console.log("fired >")
    let op1 = sarStack.pop();
    let op2 = sarStack.pop();

    // console.log(op1, op2)
    if(i.validTruthStatement(op2, op1))
        i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} > ${op1.type} ${op1.value}`, "")
    let op3 = {}

    op3.symId = i.addTemp(op1, op2, ">", "bool")
    let quad = new i.quad(i.insTypes.greaterThan, op2, op1, op3, `${op2.value} < ${op1.value}`)
    ibool.addLabel(quad)

    i.quadProxy.push(quad)
}