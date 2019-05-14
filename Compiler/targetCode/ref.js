let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    if(instruction.op2.symId[0] == "m")
    {
        return handleFunction(instruction)
    }
    
    let comment = i.writeComment(instruction)
    let loadOp1 = i.loadOp(instruction.op1, "R1")
    let loadOp2 = i.loadOp(instruction.op2, "R2", "heapOffset")
    let addOp1AndOp2 = [`ADD R1 R2`]
    if(instruction.op2.typeSar == "arr_sar")
        addOp1AndOp2.push(`LDR R1 R1`)
    let saveToOp3 = i.storeOp(instruction.op3, "stack")

    loadOp1[0] += comment

    return i.generateAsm([loadOp1, loadOp2, addOp1AndOp2, saveToOp3])
}

function handleFunction(instruction)
{
    let comment = i.writeComment(instruction)
    // let storeThis = [
    //     "MOV R1 FP"
    // ]
    let loadOp1 = i.loadOp(instruction.op1, "R1")
    loadOp1[0] += comment
    return i.generateAsm([loadOp1, "MOV R7 R1"])
}