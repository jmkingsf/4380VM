let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let jmpDeclaration = `JMP ${instruction.op1}` + comment

    return [jmpDeclaration]
}