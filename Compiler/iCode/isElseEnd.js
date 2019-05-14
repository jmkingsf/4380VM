i = require("../semantic actions/iSemanticAction")

module.exports = function()
{
    i.quadProxy.isElse = false;
    let elseQuad = new i.quad(i.insTypes.elseEnd)
    
    //elseQuad.label = i.labeler.exitLabels.pop()
    // if(i.labeler.ifLabels.length > 0 )
    // {
    //     let remainingLabel = i.labeler.ifLabels.pop()
    //     let newLabel = elseQuad.label
    //     i.labeler.backpatchExitToSkipIf(newLabel, remainingLabel, i.quadProxy.currArray)
    // }

    i.quadProxy.push(elseQuad)
}