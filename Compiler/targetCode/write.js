
let i = require("./iTCodeAlgorithms")

module.exports = function(quad)
{
    if (quad.op1.type == "char") {
        return writeChar(quad)
    }
    let loadOp1Declaration = i.loadOp(quad.op1, "R3")
    let trpDeclaration = `TRP 1`

    return i.generateAsm([loadOp1Declaration, trpDeclaration])
}

function writeChar(quad)
{
    let loadOp1Declaration = i.loadOp(quad.op1, "R3")

    if(quad.op1.sarType != "lit_sar")
        loadOp1Declaration[loadOp1Declaration.length - 1] = "LDB R3 R3"
        
    let trpDeclaration = `TRP 3`
    return i.generateAsm([loadOp1Declaration, trpDeclaration])
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

//r10 = SB
//r11 = SL
//r12 = SP

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