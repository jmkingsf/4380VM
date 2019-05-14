i = require("../semantic actions/iSemanticAction")

module.exports = function(jmpType)
{
    
    if(jmpType == "if")
    {
        let newQuad = new i.quad(i.insTypes.jmp, null, null, null, ``)
        
        //i.quadProxy.exitIfs = i.labeler.checkForIfExitLabel(newQuad, i.quadProxy.exitIfs)
        i.labeler.addIfJmp(newQuad)
        let label = i.labeler.exitLabels.pop()
        //i.labeler.backPatchIfExit(i.quadProxy.currArray)
        i.quadProxy.push(newQuad)
        i.labeler.exitLabels.push(label)

        if(i.labeler.exitLabels.length > 1 )
        {
            let newLabel = i.labeler.exitLabels.pop()
            let remainingLabel = i.labeler.exitLabels.pop()
            i.labeler.backPatchIfExit(newLabel, remainingLabel, i.quadProxy.currArray)
            i.labeler.exitLabels.push(newLabel)
        }
        
        //i.quadProxy.depositLabel = true
    }

    if(jmpType == "while")
    {
        let newQuad = new i.quad(i.insTypes.jmpWhile, null, null, null, ``)
        newQuad.op1 = i.labeler.beginWhileLabels.pop()
        i.quadProxy.push(newQuad)
        i.quadProxy.exitWhile = true
    }
    

}