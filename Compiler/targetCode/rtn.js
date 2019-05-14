let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    if(instruction.op1 == "constructor")
    {
        return constructor(instruction)
    }

    if(instruction.op1 == "func")
        return func(instruction)

    return ["TRP 0"]   
}

function constructor(instruction)
{
    let comment = i.writeComment(instruction)

    let underflowTest = [
        "MOV SP FP" + comment,
        "MOV R5 SP",
        "CMP R5 SB",
        "BGT R5 UNDERFLOW"
    ]

    let popActRecord = [
        "LDR R5 FP" + ` #popping act record for ${instruction.op1}`,
        "SUB FP #4",
        "LDR FP FP" + ` #Load previous frame address`,
    ]

    let loadThis = [
        "MOV R1 FP",
        "SUB R1 #8",
        "LDR R9 R1"
    ]

    let storeReturnValue = [
        "STR R9 SP",
        "JMR R5"
    ]
    // storeReturnValue.push("JMR R5")

    let returnVal = []
    returnVal = returnVal.concat(underflowTest)
    returnVal = returnVal.concat(loadThis)
    returnVal = returnVal.concat(popActRecord)
    returnVal = returnVal.concat(storeReturnValue)



    return returnVal
}

function func(instruction)
{
    let comment = i.writeComment(instruction)

    let underflowTest = [
        "MOV SP FP" + comment,
        "MOV R5 SP",
        "CMP R5 SB",
        "BGT R5 UNDERFLOW"
    ]

    let popActRecord = [
        "LDR R5 FP" + ` #popping act record for ${instruction.op1}`,
        "SUB FP #4",
        "LDR FP FP" + ` #Load previous frame address`,
    ]

    let storeReturnValue = [
        "JMR R5"
    ]
    // storeReturnValue.push("JMR R5")

    let returnVal = []
    returnVal = returnVal.concat(underflowTest)
    returnVal = returnVal.concat(popActRecord)
    returnVal = returnVal.concat(storeReturnValue)



    return returnVal
}