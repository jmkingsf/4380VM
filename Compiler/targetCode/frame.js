let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    let overflowTest = [
        "MOV R5 SP" + comment,
        "SUB R5 #12 #Adjust space for RTN address and this",
        "CMP R5 SL",
        "BLT R5 OVERFLOW"
    ]

    let createNewActRecord = [
        "MOV R3 FP" + ` #Creating new act record for ${instruction.op1.value}`,
        "MOV FP SP",
        "SUB SP #4",
        "STR R3 SP",
        "SUB SP #4", 
        "STR R7 SP",
        "SUB SP #4"
    ]

    let returnVal = []
    returnVal = returnVal.concat(overflowTest)
    returnVal = returnVal.concat(createNewActRecord)

    return returnVal
}