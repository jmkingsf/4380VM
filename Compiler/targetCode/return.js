let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    let underflowTest = [
        "MOV SP FP" + comment,
        "MOV R5 SP",
        "CMP R5 SB",
        "BGT R5 UNDERFLOW"
    ]

    let popActRecord = [
        "LDR R5 FP" + ` #popping act record for ${instruction.op1.value}`,
        "SUB FP #4",
        "LDR FP FP" + ` #Load previous frame address`,
    ]

    let loadReturnValue = i.loadOp(instruction.op1, "R9")
    let storeReturnValue = [
        "STR R9 SP",
        "JMR R5"
    ]
    // storeReturnValue.push("JMR R5")

    let returnVal = []
    returnVal = returnVal.concat(underflowTest)
    returnVal = returnVal.concat(loadReturnValue)
    returnVal = returnVal.concat(popActRecord)
    returnVal = returnVal.concat(storeReturnValue)



    return returnVal
}