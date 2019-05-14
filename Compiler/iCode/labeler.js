let exitNum = 0;
function generateExitLabel()
{
    exitNum += 1;
    //module.exports.prevExitLabel = module.exports.exitLabel
    module.exports.exitLabels.push("Exit" + exitNum);
}

let ifNum = 0
function generateIfLabel()
{
    ifNum += 1;
    //module.exports.prevExitLabel = module.exports.exitLabel
    module.exports.ifLabels.push("SkipIf" + ifNum);
}

let endWhileNum = 0
function generateEndWhileLabel()
{
    endWhileNum += 1;
    //module.exports.prevExitLabel = module.exports.exitLabel
    module.exports.endWhileLabels.push("EndWhile" + endWhileNum);
}

let beginWhileNum = 0
function generateBeginWhileLabel()
{
    beginWhileNum += 1;
    //module.exports.prevExitLabel = module.exports.exitLabel
    module.exports.beginWhileLabels.push("BeginWhile" + beginWhileNum);
}

//function backPatch

module.exports = {
    exitLabels: [],
    ifLabels: [],
    endWhileLabels: [],
    beginWhileLabels: [],
    //prevExitLabel: null,
    backpatchNum: 0,
    backPatchIfExit: function(newLabel, remainingLabel, currArray)
    {
        this.backPatchOp1(remainingLabel, newLabel, currArray, 0)
    },
    backPatchExitToIf: function(currArray)
    {
        let curSkipIfLabel = this.ifLabels[this.ifLabels.length - 1]
        let newExitLabel = this.exitLabels[this.exitLabels.length - 1]
        this.backPatchOp2(curSkipIfLabel, newExitLabel, currArray, 1)
        this.ifLabels.pop()
    },
    backpatchExitToSkipIf: function(newLabel, remainingLabel, currArray)
    {
        this.backPatchOp2(remainingLabel, newLabel, currArray, 1)
        //this.ifLabels.pop()
    },
    backpatchBeginToEndWhile: function(currArray, prevQuad)
    {
        let prevEndWhileLabel = prevQuad.label
        generateBeginWhileLabel()
        let curBeginLabel = this.beginWhileLabels[this.beginWhileLabels.length - 1]
        this.backPatchOp2(prevEndWhileLabel, curBeginLabel, currArray)
        i.quadProxy.exitWhile = false
        this.beginWhileLabels.push(curBeginLabel)
        prevQuad.label = curBeginLabel
    },
    backPatchOp2: function(prevLabel, newLabel, currArray, skipEndBackPatchNum)
    {
        let i = currArray.length() - 1
        for(i; i > 0; i--)
        {
            let item = currArray.value[i]
            // if(item.type == "EndBackPatch")
            // {
            //     if(skipEndBackPatchNum == 0)
            //         return
            //     skipEndBackPatchNum -= 1
            // }
            if(item.op2)
            {
                
                if(item.op2 == prevLabel)
                {
                    item.op2 = newLabel
                }
            }
        }
    },
    backPatchOp1: function(prevLabel, newLabel, currArray, skipEndBackPatchNum)
    {
        //this.backPatchOp1(remainingLabel, newLabel, currArray, 0)
        let i = currArray.length() -1;

        for(i; i > 0; i--)
        {
            let item = currArray.value[i]

            if(item.op1)
            {
                
                if(item.op1 == prevLabel)
                {
                    item.op1 = newLabel
                }
            }
        }
    },
    checkForIfExitLabel: function(quad, exitIfs) {
        // if (exitIfs) {
        //     this.backPatchExitToIf(i.quadProxy.currArray)
        //     quad.label = labeler.exitLabels[labeler.exitLabels.length - 1]
        //     this.exitLabels.pop()
        //     return false
        // }
        return false
    },
    generateIfLabel: function()
    {
        this.ifLabelNum += 1;
        return `${this.ifLabelNum}`
    },
    generateWhileLabel: function()
    {
        this.whileLabelNum += 1;
        return `${this.whileLabelNum}`
    },
    generateElseIfLabel: function()
    {
        this.elseIfLabelNum += 1;
        return `${this.elseIfLabelNum}`
    },
    addIfJmp: function(quad)
    {
        generateExitLabel()
        quad.op1 = this.exitLabels[this.exitLabels.length - 1]
    },
    addSkipIfLabel: function(quad)
    {
        generateIfLabel()
        quad.op2 = this.ifLabels[this.ifLabels.length - 1]
    },
    addEndWhileLabel: function(quad)
    {
        generateEndWhileLabel()
        quad.op2 = this.endWhileLabels[this.endWhileLabels.length - 1]
    },
    addBeginWhileLabel: function(prevQuad, exitWhile)
    {
        generateBeginWhileLabel()
        prevQuad.label = this.beginWhileLabels[this.beginWhileLabels.length - 1]

        
        return false
    },
    curLabels: [],
    curWhileLabels: [],
    endWhileLabels: [],
    elseIfLabel: null,
    ifLabelNum: 0,
    elseIfLabelNum: 0,
    whileLabelNum: 0,
    endWhileLabelNum: 0
}