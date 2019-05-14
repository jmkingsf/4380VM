i = require("./iSemanticAction")

module.exports = function(tokenType)
{
    //checks if current scope contains duplicates
    //how do we get the current scope?
    //I think Iexist should append scope if necessary

    let topSar = i.sas.pop()
    let nextSar = i.sas.pop()
    //need scope of topSar

    
    let found = false;
    //let scope = i.symT.scopeStack
    let symsAtCurrentScope = i.symT.getSymsAtScope(`g.${nextSar.type}`)
    let propSym;

    allowPrivate = nextSar.value == nextSar.type
    //console.log(symsAtCurrentScope)
    symsAtCurrentScope.forEach((item)=> {

        if(isMatch(topSar.value, item, tokenType, allowPrivate))
        {
            topSar.symId = item.key
            propSym = item
            return
        }
        
    })

    if(!propSym)
        i.throwError(topSar.lineNum, `${tokenType} ${topSar.value} not defined/public in class ${nextSar.type}`, ``)
        

    if(tokenType == "function" && i.invalidParams(propSym, topSar))
    {
        let params = "";
        topSar.params.forEach((param) => {
            if(params != "")
                params = ", " + params
            params = `${param.type}` + params
        })

        i.throwError(topSar.lineNum, `function ${topSar.value}(${params}) not defined`, '')
    }

    

   

    

    let refSar = new i.sar(topSar.value)
    refSar.prevSar = topSar
    refSar.type = propSym.data.type
    topSar.type = propSym.data.type
    refSar.lineNum = nextSar.lineNum
    i.sas.push(refSar)


    

    if(topSar.sarType == "func_sar")
    {
        let newQuad = new i.quad(i.insTypes.frame, topSar, nextSar, null, `${nextSar.value}.${topSar.value}`)

        i.addTemp(topSar, null, "function")

        

        let callQuad = new i.quad(i.insTypes.call, topSar, null, null, `${topSar.value}`)
        let refQuad = new i.quad(i.insTypes.ref, nextSar, topSar, i.sas.top(), `${nextSar.value}.${topSar.value}`)
        i.quadProxy.push(refQuad)
        i.quadProxy.push(newQuad)

        let index = topSar.params.length - 1
        for (index; index >= 0; index--)
        {
            let param = topSar.params[index] 
            let newQuad = new i.quad(i.insTypes.push, param, null, null, `${param.value}`)
            i.quadProxy.push(newQuad)
        }

        i.quadProxy.push(callQuad)

        peak()
    }

    if(tokenType == "array")
    {
        topSar.type = topSar.type.replace("@:", "")
        i.addTemp(topSar, topSar.expSar, "array")
        let refQuad = new i.quad(i.insTypes.ref, nextSar, topSar, i.sas.top(), `${nextSar.value}.${topSar.value}[]`)

        let refSar = i.sas.top()
        i.sas.pop()

        i.addTemp(topSar, topSar.expSar, "array")
        let aefQuad = new i.quad(i.insTypes.aef, refSar, topSar.expSar, i.sas.top(), `${nextSar.value}.${topSar.value}[${topSar.expSar.value}]`)
        i.quadProxy.push(refQuad)
        i.quadProxy.push(aefQuad)

    }

    if(topSar.sarType == "iPush")
    {
        i.addTemp(topSar, null, "refVar")

        let newQuad = new i.quad(i.insTypes.ref, nextSar, topSar, i.sas.top(), `${nextSar.value}.${topSar.value}`)
        i.quadProxy.push(newQuad)

    }
    
}

function peak()
{
    let tempVar = i.sas.top()
    let peakQuad = new i.quad(i.insTypes.peek, tempVar, null, null, `${tempVar.value}`)
    i.quadProxy.push(peakQuad)
}

function isMatch(name, sym, tokenType, allowPrivate)
{
    let kindLookUp;
    switch(tokenType)
    {
        case "variable":
            kindLookUp = "var"
            break;
        case "array":
            kindLookUp = "@:"
    }

    if(!allowPrivate)
        if(sym.data.modifier != "public")
            return false

    return sym.value == name  && (kindLookUp == null || (sym.kind.includes(kindLookUp) || sym.data.type.includes(kindLookUp))) && sym.kind != "temp"
}