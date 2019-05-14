i = require("../semantic actions/iSemanticAction")

module.exports = function()
{
    i.quadProxy.isElse = false;
    let elseQuad = new i.quad(i.insTypes.else)
    
    elseQuad.label = i.labeler.ifLabels.pop()
    i.quadProxy.push(elseQuad)
}