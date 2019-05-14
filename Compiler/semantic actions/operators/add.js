i = require("../iSemanticAction")

module.exports = function()
{
    // console.log("fired +")
    // console.log(i.sas.value)
    // console.log()
    let op1 = i.sas.pop();
    let op2 = i.sas.pop();

    if(op1.type != op2.type || op1.type != "int" )
    {
        i.throwError(op1.lineNum, `Invalid Operation ${op2.type} ${op2.value} + ${op1.type} ${op1.value}`, "")
    }

    i.addTemp(op1, op2, "+" )
    //i.insStack.push(i.insTypes.add)
    i.quadProxy.push(new i.quad(i.insTypes.add,op2, op1, i.sas.top(), `${op2.value} + ${op1.value}`))
}


