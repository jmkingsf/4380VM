let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let movSL = "MOV R1 SL" + comment
    let storeToTemp = i.storeOp(instruction.op2, "stack")

    let getOffset = i.loadOp(instruction.op1, "R1")
    let growHeap = `ADD SL R1`

    let asmDeclaration = i.generateAsm([movSL, storeToTemp, getOffset, growHeap])

    return asmDeclaration
}