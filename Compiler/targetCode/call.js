let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let movPcDeclaration = `MOV R1 PC` + comment
    let computeReturnAddress = `ADD R1 #48`
    let storeReturnAddress = "STR R1 FP"
    let jmpToFunc = `JMP ${instruction.op1.symId}`

    return [movPcDeclaration, computeReturnAddress, storeReturnAddress, jmpToFunc]
}