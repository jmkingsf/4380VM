i = require("../semantic actions/iSemanticAction")


module.exports = function()
{
    let beginWhile = new i.quad(i.insTypes.beginWhile)
    i.quadProxy.push(beginWhile)
}