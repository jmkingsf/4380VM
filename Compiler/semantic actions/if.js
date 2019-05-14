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
        i.throwError(token.lineNum, "if requires bool got", `${type}`)

    // let op2 = topSar.childTokens[1]
    // let op1 = topSar.childTokens[0]
    //let curLabel = `SKIPIF${i.generateLabel()}`
    let newQuad = new i.quad(i.insTypes.branchFalseIf,topSar , null, null, `${topSar.value}`)
    i.labeler.addSkipIfLabel(newQuad)
    i.quadProxy.push(newQuad)
    i.quadProxy.isIf = true

}
