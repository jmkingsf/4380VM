i = require("./iSemanticAction")

module.exports = function(tokenType)
{
    let exp_sar = i.sas.pop()
    let type_sar = i.sas.pop()

    if(exp_sar.sarType == "type_sar")
    {
        type_sar = exp_sar
        exp_sar.type = "null"
    }


    if(exp_sar.type != "int" || exp_sar == null)
        i.throwError(exp_sar.lineNum,  `Array requires int index got "${exp_sar.type}"`, "")

    // Using the Argument List SAR and the type SAR test 
    // if a constructor exits that can create an instance
    //  of the type of object.  Push a SAR for the constructor
    //   (e.g., SAS.push(new_sar) ) onto the SAS.

    let symsAtCurrentScope = i.symT.getSymsAtScope(`g.${type_sar.value}`)
    let propSym;
    //console.log(symsAtCurrentScope)
    symsAtCurrentScope.forEach((item)=> {

        if(isMatch(type_sar.value, item))
        {
            propSym = item
            return
        }
        
    })
    
    if(!propSym && type_sar.value != "int" && type_sar.value != "char")
        i.throwError(type_sar.lineNum, `Type ${type_sar.value}`, 'not defined')

    
        //line_number ": Constructor " <lexeme>”(“ <arg_list_data_type> ") not defined"

    type_sar.value = "@:" + type_sar.value

    let new_sar = new i.sar(type_sar)
    new_sar.type = type_sar.value
    new_sar.lineNum = type_sar.lineNum
    new_sar.exp_sar = exp_sar
    i.sas.push(new_sar)

    iNewArray(new_sar)
}

function iNewArray(new_sar)
{
    i.addTemp(new_sar, null, "variable")

    let size = getTypeSize(i.sas.top())
    
    let mulQuad = new i.quad(i.insTypes.mul, new_sar.exp_sar,`#${size}`, i.sas.top(), `new ${new_sar.value}[${new_sar.exp_sar.value}]`)
    i.quadProxy.push(mulQuad)

    let symOfSize = i.sas.top()
    i.addTemp(new_sar, null, "variable")
    let newQuad = new i.quad(i.insTypes.newA, symOfSize, i.sas.top(), null, `new ${new_sar.value}()`)
    i.quadProxy.push(newQuad)

    // new_sar.symId = sym.key
    // let frameQuad = new i.quad(i.insTypes.frame, new_sar, i.sas.top(), null, `${new_sar.value}()`)
    // i.quadProxy.push(frameQuad)

    // new_sar.params.forEach(param => {
    //     let newQuad = new i.quad(i.insTypes.push, param, null, null, `${param.value}`)
    //     i.quadProxy.push(newQuad)
    // })
    // let callQuad = new i.quad(i.insTypes.call, new_sar, null, null, `${new_sar.value}`)
    // i.quadProxy.push(callQuad)
    // peak()

}

function isMatch(name, sym)
{
    return sym.value == name
}

function getTypeSize(op)
{
    if(op.type == "int" || op.type == "char"){
        return 4
    }else{
        if(op.type[0] == "@")
        {
            op.type = op.type.replace("@:", '')
            if(op.type == "int" || op.type == "char")
                return 4
        }
        let size = i.symT.getSizeOfLocsForClass(`g.${op.type}`)
        return size
        //throw new Error("Array's of non-primitive types is unsupported")
    }
}