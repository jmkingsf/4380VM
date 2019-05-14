let i = require("./iTCodeAlgorithms")

module.exports = function(instruction)
{
    let comment = i.writeComment(instruction)

    return ["LDA R6 FALSE" + comment]   
}