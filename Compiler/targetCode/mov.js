let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let loadOp1Declaration = i.loadOp(instruction.op1, "R1")

    try{
        loadOp1Declaration = loadOp1Declaration.concat(i.storeOp(instruction.op2))

    } catch (exception) {
        console.log(instruction.lineNum)
        throw exception
    }

    loadOp1Declaration[0] += comment
    return loadOp1Declaration
}