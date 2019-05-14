i = require("../semantic actions/iSemanticAction")

module.exports = function(funcName)
{
    i.quadProxy.switchToMQuadArray()
    let item = i.symT.getSymIdOfToken2(funcName)
    let scope = i.symT.getScope()
    let newQuad = new i.quad(i.insTypes.func, item, scope, null, `print func arguments here?`)
    newQuad.label = funcName

    i.quadProxy.push(newQuad)
}