let i = require("./iTCodeAlgorithms")

let frame = require("./frame")
let call = require("./call")
let func = require("./func")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    let returnVal = [
        "TRP 0" + comment
    ]


    return returnVal
}