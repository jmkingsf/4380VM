let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    let loadOperation1 = i.loadOp(instruction.op1, "R1")
    let pushDeclaration = `STR R1 SP`
    let moveSp = `SUB SP #4`

    if(instruction.op1.symId[0] == "t" || instruction.op1.symId[0] == "l" || instruction.op1.symId[0] == 'p')
        loadOperation1[0] = "MOV R1 R3"

    loadOperation1[0] += comment;

    return i.generateAsm([loadOperation1, pushDeclaration, moveSp])
}