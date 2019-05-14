let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let movSL = "MOV R7 SL" + comment
    let growHeap = `ADD SL #${instruction.op1}`
    let storeThisAddress = i.storeOp(instruction.op2)
    i.isConstructor = true

    let asmDeclaration = i.generateAsm([movSL, growHeap, storeThisAddress])

    return asmDeclaration
}