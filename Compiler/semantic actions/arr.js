oStack = require('../semOperatorStack')
sar = require('./semanticActionRecord')
i = require("./iSemanticAction")

module.exports = function()
{
    //console.log("fired arr")
    let expSar = i.sas.pop()
    let idSar = i.sas.pop()

    if(expSar.type != "int")
        i.throwError(expSar.lineNum, "Array requires int index got", `${expSar.type}`)
    
    let arr_sar = new i.sar()
    arr_sar.typeSar="arr_sar"
    arr_sar.lineNum=expSar.lineNum
    arr_sar.value = `${idSar.value}`
    arr_sar.expSar = expSar
    arr_sar.index = expSar.value

    i.sas.push(arr_sar)
    //console.log(i.sas.value)
    
}