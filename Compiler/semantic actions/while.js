i = require("./iSemanticAction")

module.exports = function(token)
{
    //checks if current scope contains duplicates
    //how do we get the current scope?
    //I think Iexist should append scope if necessary

    let topSar = i.sas.pop()

    let type = "no value"
    if(topSar)
        type = topSar.type

    if(topSar == null || topSar.type != "bool")
        i.throwError(token.lineNum, "while requires bool got", `${type}`)

    let newQuad = new i.quad(i.insTypes.branchFalseWhile,topSar , null, null, `${topSar.value}`)
    i.labeler.addEndWhileLabel(newQuad)
    i.quadProxy.push(newQuad)
    i.quadProxy.isIf = true
    //let prevQuad = i.quadProxy.getPrevQuad()
    

    handleBackPatching()

}

function handleBackPatching()
{
    let beginWhileQuad = i.quadProxy.getBeginWhileQuad()
    if(beginWhileQuad.label == "")
    {
        i.quadProxy.exitWhile = i.labeler.addBeginWhileLabel(beginWhileQuad, i.quadProxy.exitWhile)       
    }else {
        i.labeler.backpatchBeginToEndWhile(i.quadProxy.currArray, beginWhileQuad)
    }
}
