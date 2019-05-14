sarStack = require('../semSarStack')
sar = require('./semanticActionRecord')
symTable = require("../SymbolTable")
sarTypes = require("./semanticActionRecords")

module.exports = function(tokenType)
{
    let iPushRecord = sarStack.pop()
    //console.log(iPushRecord)

    //get scope at class method level, class level, and global
    //let syms = i.symT.getSymsAtScope("g.cat")
    if(iPushRecord.value == "this")
    {
        iPushRecord.value = symTable.getScope().split('.')[1]
    }

    let found = false;
    let token = iPushRecord.value
    //console.log(syms)

    let typeLooker;
    switch(tokenType)
    {
        case "variable":
            break;
        case "array":
            typeLooker = "@"
            break;
        case "function":
            break;
    }
    //always choose my scope
    let scope = JSON.parse(JSON.stringify(i.symT.scopeStack))
    while(!found && scope.length > 0)
    {
        let cScope = scope.pop()
        let syms = symTable.getSymsAtScope(cScope)
        syms.forEach(item => {
            if(item.value == iPushRecord.value && (typeLooker == null || item.data.type.includes(typeLooker)) && item.scope != "g" && item.kind != "temp")
            {
                found = true;
                type = item.data.type
                symToken = item
                return
                //cScope = item.scope
            }
        })
    }

    if(!found && tokenType!= "function")
        i.throwError(token.lineNum, `${tokenType} ${token}`, "not defined")

    if((tokenType == "function" && i.invalidParams(symToken, iPushRecord)) || (!found))
    {
        let params = "";
        iPushRecord.params.forEach((param) => {
            if(params != "")
                params = ", " + params
            params = `${param.type}` + params
        })
        i.throwError(iPushRecord.lineNum, `Function ${iPushRecord.value}(${params}) not defined`, '')
    }
    //7: Function f(bool, int, char) not defined"
        

    
    id_sar = new sar();
    id_sar.value = iPushRecord.value
    id_sar.prevSar = iPushRecord
    id_sar.lineNum = iPushRecord.lineNum
    id_sar.symId = symToken.key

    if(iPushRecord.typeSar == "arr_sar")
        type = type.split(':').pop()

    id_sar.type = type
    id_sar.sarType = sarTypes.id_sar
    id_sar.symId = symToken.key
    sarStack.push(id_sar)

    if(tokenType == "function")
    {
        //add temp symbol for value
        i.addTemp(id_sar, null, "function")

        let newQuad = new i.quad(i.insTypes.frame, id_sar, "this", null, `${id_sar.value}`)
        i.quadProxy.push(newQuad)
        let callQuad = new i.quad(i.insTypes.call, id_sar, null, null, `${id_sar.value}`)

        //use this instead of below to fix pushpop error
        let index = id_sar.prevSar.params.length - 1
        for (index; index >= 0; index--)
        {
            let param = id_sar.prevSar.params[index] 
            let newQuad = new i.quad(i.insTypes.push, param, null, null, `${param.value}`)
            i.quadProxy.push(newQuad)
        }

        i.quadProxy.push(callQuad)
        peak()
    }

    if(tokenType == "array")
    {
        i.addTemp(id_sar, id_sar.prevSar.expSar, "array")

        let aefQuad = new i.quad(i.insTypes.aef, id_sar, id_sar.prevSar.expSar, i.sas.top(), `${id_sar.value}[${id_sar.prevSar.expSar.value}]`)
        i.quadProxy.push(aefQuad)
    }

    return true
}
// let symFunc;

// //adjust scope
// let prevScope = i.symT.getScope()
// i.symT.popScope()

// let symsAtCurrentScope = i.symT.getSymsAtScope()
// symsAtCurrentScope.forEach((item)=> {

//     if(isMatch(id_sar.value, item))
//     {
//         symFunc = item
//         return
//     }
        
    
// })


// if(symFunc.data.parameters.length != al_sar.value.length)
//     i.throwError(id_sar.lineNum, "function does not contain correct number of arguements", '')

//     i.symT.scopeStack.push(prevScope)
function peak()
{
    let tempVar = i.sas.top()
    let peakQuad = new i.quad(i.insTypes.peek, tempVar, null, null, `${tempVar.value}`)
    i.quadProxy.push(peakQuad)
}