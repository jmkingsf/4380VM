let i = require("./iTCodeAlgorithms")

let frame = require("./frame")
let call = require("./call")
let func = require("./func")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    let returnVal = []

    instruction.op2 = "g.main"
    returnVal = returnVal.concat(frame(instruction))
    returnVal = returnVal.concat(func(instruction))
    returnVal = returnVal.concat(call(instruction))
    returnVal[returnVal.length-1] = "JMP main"
    returnVal.push("TRP 0")
    returnVal.push("main LDA R1 main")

    return returnVal
}