let i = require("./iTCodeAlgorithms")

let symT = require("../SymbolTable.js")
let sQuadArray = require("../iCode/sQuadArray")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    let spaceOnStack = symT.getSizeOfTempAndLocsForFunction(instruction.op2)
    let allocateSpaceOnStackDeclaration = `SUB SP #${spaceOnStack}` + comment
    if(instruction.label)
    {
        if(!sQuadArray.value[instruction.label] || sQuadArray.value[instruction.label].length == 0)
        {
            instruction.label = instruction.op1
        }
    }

    return [allocateSpaceOnStackDeclaration]
}