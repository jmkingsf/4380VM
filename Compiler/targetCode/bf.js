let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    let loadOp1Declaration = i.loadOp(instruction.op1, "R1")
    loadOp1Declaration[0] += comment
    let brzDeclaration = `BRZ R1 ${instruction.op2}`

    let asmDeclarations = []
        asmDeclarations = asmDeclarations.concat(loadOp1Declaration)
        asmDeclarations.push(brzDeclaration)
    return asmDeclarations
}