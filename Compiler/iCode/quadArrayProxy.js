qTypes = require("./instructionTypes")
labeler = require('./labeler')

module.exports = {
    sQuadArray: require("./sQuadArray"),
    quadArray: require("./quadArray"),
    currArray: require("./sQuadArray"),
    depositLabel: false,
    isElse: false,
    isBoolean: false,
    isIf: false,
    labeler: require('./labeler'),
    switchToSQuadArray: function()
    {
        this.currArray = require("./sQuadArray")
    },
    switchToMQuadArray: function()
    {
        this.currArray = require("./quadArray")
    },
    push:function(quad) {

        this.handleSpecialQuads(quad)
        this.currArray.push(quad)
    },
    getPrevQuad: function() {
        return this.currArray.value[this.currArray.value.length - 2]
    },
    getBeginWhileQuad: function() {
        let i = this.currArray.value.length - 1
        for(i; i > 0; i--)
        {
            let quad = this.currArray.value[i];
            if(quad.type == "beginWhile")
            {
                return this.currArray.value[i+1]
            }
        }
    },
    handleSpecialQuads: function(quad)
    {
        if(quad.type == "COMMENT")
            return
        //deposit label for skipIf
        // if(labeler.ifLabels.length > 0)
        // {
        //     quad.label = labeler.ifLabels.pop()
        // }

        if(labeler.exitLabels.length > 0 && this.isIf == false)
        {
            quad.label = labeler.exitLabels.pop()
            if(labeler.ifLabels.length >0)
            {
                labeler.backpatchExitToSkipIf(quad.label, labeler.ifLabels.pop(), this.currArray)
            }

        }

        if(this.exitWhile && quad.type != "beginWhile"){
            this.exitWhile = false
            quad.label = labeler.endWhileLabels.pop()
        } else if(this.startMain)
        {
            quad.label = "main"
            this.startMain = false
        }
    },
    top:function()
    {
        return this.currArray.top()
    },
    pop:function()
    {
        return this.currArray.pop()
    },
    clear: function()
    {
        this.currArray.clear()
    },
    print: function()
    {
        console.log("squad array")
        this.sQuadArray.print()
        console.log("quadArray")
        this.quadArray.print()
    }
}