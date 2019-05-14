i = require("../semantic actions/iSemanticAction")

module.exports = {
    addLabel: function(quad) {
        if(i.quadProxy.exitIfs)
        {
            // labeler.backPatchExitToIf(i.quadProxy.currArray)
            // quad.label = i.labeler.exitLabels[i.labeler.exitLabels.length - 1]
            // i.quadProxy.exitIfs = false
        } else if(labeler.ifLabels.length > 0) {
            //quad.label = i.labeler.ifLabels[labeler.ifLabels.length - 1]
        }        
    }

}