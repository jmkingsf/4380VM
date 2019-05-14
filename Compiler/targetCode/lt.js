let i = require("./iTCodeAlgorithms")

let labelNum = 0;

module.exports = function(instruction)
{
    let ifFalseJmpLbl = `lt${labelNum++}`
    let ifTrueJmpLbl = `lt${labelNum++}`
    let comment = i.writeComment(instruction)
    let loadOp1Declaration = i.loadOp(instruction.op1, "R1")
        loadOp1Declaration[0] += comment
    let loadOp2Declaration = i.loadOp(instruction.op2, "R2")
    let cmpDeclaration = `CMP R1 R2`
    let bltDeclaration = `BLT R1 ${ifTrueJmpLbl}`
    let setFalseDeclaration = "LDR R1 FALSE"
    let jmpToStoreDeclaration = `JMP ${ifFalseJmpLbl}`
    let setTrueDeclaration = `${ifTrueJmpLbl} LDR R1 TRUE`

    let strDeclaration = i.storeOp(instruction.op3)
        strDeclaration[0] = `${ifFalseJmpLbl} ${strDeclaration[0]}`

    let asmDeclarations = []
        asmDeclarations = asmDeclarations.concat(loadOp1Declaration)
        asmDeclarations = asmDeclarations.concat(loadOp2Declaration)
        asmDeclarations.push(cmpDeclaration)
        asmDeclarations.push(bltDeclaration)
        asmDeclarations.push(setFalseDeclaration)
        asmDeclarations.push(jmpToStoreDeclaration)
        asmDeclarations.push(setTrueDeclaration)
        asmDeclarations = asmDeclarations.concat(strDeclaration)



    return asmDeclarations
}