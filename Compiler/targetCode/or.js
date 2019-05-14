let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let loadOp1Declaration = i.loadOp(instruction.op1, "R1")
        loadOp1Declaration[0] += comment
    let loadOp2Declaration = i.loadOp(instruction.op2, "R2")
    let andDeclaration = "OR R1 R2"
    let strDeclaration = i.storeOp(instruction.op3)

    let asmDeclaration = i.generateAsm([loadOp1Declaration, loadOp2Declaration, andDeclaration, strDeclaration])

    return asmDeclaration
}