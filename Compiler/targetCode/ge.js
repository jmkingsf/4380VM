let i = require("./iTCodeAlgorithms")

let labelNum = 0;

module.exports = function(instruction)
{
    let ifFalseJmpLbl = `ge${labelNum++}`
    let ifTrueJmpLbl = `ge${labelNum++}`
    let comment = i.writeComment(instruction)
    let loadOp1Declaration = i.loadOp(instruction.op1, "R1")
        loadOp1Declaration[0] += comment
    let loadOp2Declaration = i.loadOp(instruction.op2, "R2")
    let cmpDeclaration = `CMP R1 R2`
    let bltDeclaration = `BGT R1 ${ifTrueJmpLbl}`
    let loadOp1Declaration2 = i.loadOp(instruction.op1, "R1")
    let cmpDeclaration2 = `CMP R1 R2`
    let brzDeclaration = `BRZ R1 ${ifTrueJmpLbl}`
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
        asmDeclarations = asmDeclarations.concat(loadOp1Declaration2)
        asmDeclarations.push(cmpDeclaration2)
        asmDeclarations.push(brzDeclaration)
        asmDeclarations.push(setFalseDeclaration)
        asmDeclarations.push(jmpToStoreDeclaration)
        asmDeclarations.push(setTrueDeclaration)
        asmDeclarations = asmDeclarations.concat(strDeclaration)



    return asmDeclarations
}