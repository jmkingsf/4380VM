i = require("../semantic actions/iSemanticAction")
labeler = require('./labeler')


module.exports = function()
{
    i.quadProxy.exitIfs = true;
    i.quadProxy.isIf = false
    
    endIfQuad = new i.quad(i.insTypes.endIf)
    // endIfQuad.label = i.labeler.exitLabels.pop();
    // if(i.labeler.ifLabels.length > 0 )
    // {
    //     let remainingLabel = i.labeler.ifLabels.pop()
    //     let newLabel = endIfQuad.label
    //     i.labeler.backpatchExitToSkipIf(newLabel, remainingLabel, i.quadProxy.currArray)
    // }
    i.quadProxy.push(endIfQuad)

}