let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let peekDeclaration = `LDR R1 SP` + comment
    let storeDeclarations = i.storeOp(instruction.op1)

    return i.generateAsm([peekDeclaration, storeDeclarations])
}