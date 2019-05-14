i = require("./iSemanticAction")

module.exports = function(tokenType)
{
    let al_sar = i.sas.pop()
    let type_sar = i.sas.pop()

    // Using the Argument List SAR and the type SAR test 
    // if a constructor exits that can create an instance
    //  of the type of object.  Push a SAR for the constructor
    //   (e.g., SAS.push(new_sar) ) onto the SAS.

    let symsAtCurrentScope = i.symT.getSymsAtScope(`g.${type_sar.value}`)
    let propSyms = [];
    //console.log(symsAtCurrentScope)
    symsAtCurrentScope.forEach((item)=> {

        if(isMatch(type_sar.value, item))
        {
            propSyms.push(item)
        }
        
    })
    
    let argDataTypes = []
    // let t = al_sar.params.length - 1
    // for(t; t >= 0; t--)
    // {
    //     argDataTypes.push(al_sar.params[t].type)
    // }

    al_sar.params.forEach(param =>
        {
            argDataTypes.push(param.type)
        })

    let noFuncValid = true;
    propSyms.some((sym) => {
        if(!i.invalidParams(sym, al_sar))
            noFuncValid = false
    })
    if(noFuncValid || propSyms.length == 0)
        i.throwError(type_sar.lineNum, `Constructor ${type_sar.value}(${argDataTypes})`, 'not defined')

    
        //line_number ": Constructor " <lexeme>”(“ <arg_list_data_type> ") not defined"

    let new_sar = new i.sar(type_sar.value)
    new_sar.type = type_sar.value
    new_sar.lineNum = type_sar.lineNum
    new_sar.params = al_sar.params
    i.sas.push(new_sar)

    iNewICode(new_sar)
}

function iNewICode(new_sar)
{
    i.addTemp(new_sar, null, "constructor")
    
    //console.log(i.symT.table)
    // let sym = 
    let sym = i.symT.getConstructor(new_sar.value)
    let size = i.symT.getSizeOfLocsForClass(`g.${new_sar.value}`)
    let newQuad = new i.quad(i.insTypes.newI, size, i.sas.top(), null, `new ${new_sar.value}()`)
    i.quadProxy.push(newQuad)

    new_sar.symId = sym.key
    let frameQuad = new i.quad(i.insTypes.frame, new_sar, i.sas.top(), null, `${new_sar.value}()`)
    i.quadProxy.push(frameQuad)

    for(let t = new_sar.params.length-1; t >= 0; t--)
    {
        let param = new_sar.params[t]
        let newQuad = new i.quad(i.insTypes.push, param, null, null, `${param.value}`)
        i.quadProxy.push(newQuad)
    }
    // new_sar.params.forEach(param => {
        
    // })
    let callQuad = new i.quad(i.insTypes.call, new_sar, null, null, `${new_sar.value}`)
    i.quadProxy.push(callQuad)
    peak()
}

function peak()
{
    let tempVar = i.sas.top()
    let peakQuad = new i.quad(i.insTypes.peek, tempVar, null, null, `${tempVar.value}`)
    i.quadProxy.push(peakQuad)
}

function isMatch(name, sym)
{
    return sym.value == name && sym.kind != "temp"
}
