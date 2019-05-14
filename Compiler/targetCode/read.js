
let i = require("./iTCodeAlgorithms")

module.exports = function(quad)
{
    if (quad.op1.type == "char") {
        return readChar(quad)
    }
    let readInt = `TRP 2`
    let movToR1 = "MOV R1 R3"
    let storeToOp = i.storeOp(quad.op1)

    return i.generateAsm([readInt, movToR1, storeToOp])
}

function readChar(quad)
{
    let readChar = `TRP 4`
    let movToR1 = "MOV R1 R3"
    let storeToOp = i.storeOp(quad.op1)

    return i.generateAsm([readChar, movToR1, storeToOp])
}

let registersUsed = []
function initializeRegistersInUse() {
    let i = 0;
    for (i; i < 10; i++)
    {
        registersUsed[i] = false
    }

    //R3 is reserved for input and output
    registers[3] = true
}

function getFreeRegister()
{
    let i = 0;
    for (i; i < 10; i++)
    {
        if(registersUsed[i] == false)
        {
            registersUsed[i] = true
            return i 
        }
    }
}