let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)
    let loadOperation1 = i.loadOp(instruction.op1, "R1")

    let loadOperation2;
    let addDeclaration;
    if(instruction.op2.type) {
        loadOperation2 = i.loadOp(instruction.op2, "R2")
        addDeclaration = "MUL R1 R2"
    } else {
        loadOperation2 = `#MUL by ${instruction.op2} for array`
        addDeclaration = `MUL R1 ${instruction.op2}`
    }
    let strDeclaration = i.storeOp(instruction.op3)
    //`STR R1 ${instruction.op3.symId}`

    let asmDeclaration = []
    asmDeclaration = asmDeclaration.concat(loadOperation1)
    asmDeclaration = asmDeclaration.concat(loadOperation2)

    asmDeclaration.push(addDeclaration)
    asmDeclaration = asmDeclaration.concat(strDeclaration)

    asmDeclaration[0] += comment

    return asmDeclaration
}



