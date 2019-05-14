let i = require("./iTCodeAlgorithms")
let symT = require("../SymbolTable")
module.exports = function(instruction)
{
    if(instruction.op2.symId[0] == "m")
    {
        return i.generateAsm(i.loadOp(instruction.op1, "R1"), "MOV R7 R1")
    }
    
    let comment = i.writeComment(instruction)
    let loadOp1 = i.loadOp(instruction.op1, "R1")
    let loadOp2 = i.loadOp(instruction.op2, "R2")
    let calcSize = `MUL R2 #${getTypeSize(instruction.op1)}`
    let calcEndInHeap = `ADD R1 R2`
    let storeToOp3 = i.storeOp(instruction.op3, "stack")
    symT.table[instruction.op3.symId].loadFromHeap = true

    loadOp1[0] += comment

    return i.generateAsm([loadOp1, loadOp2, calcSize, calcEndInHeap, storeToOp3])
}


function getTypeSize(op)
{
    if(op.type == "int" || op.type == "char"){
        return 4
    }else{
        let size = symT.getSizeOfLocsForClass(`g.${op.type}`)
        return size
        //throw new Error("Array's of non-primitive types is unsupported")
    }
}