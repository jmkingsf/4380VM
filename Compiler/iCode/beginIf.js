i = require("../semantic actions/iSemanticAction")
let insideIf = false

module.exports = function()
{
    let beginIf = new i.quad(i.insTypes.beginIf)


    // if(i.labeler.ifLabels.length > 0 && !insideIf)
    // {
    //     beginIf.label = i.labeler.ifLabels.pop()
    //     // let newLabel = elseQuad.label
    //     // i.labeler.backpatchExitToSkipIf(newLabel, remainingLabel, i.quadProxy.currArray)
    // }
    insideIf = true

    i.quadProxy.push(beginIf)

}