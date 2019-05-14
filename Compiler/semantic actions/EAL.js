oStack = require('../semOperatorStack')
sar = require('./semanticActionRecord')
i = require("./iSemanticAction")

module.exports = function()
{
    //console.log("fired EAL")

    let argTokens = []
    while(i.sas.top() != null && i.sas.top().sarType != "bal_sar")
    {
        let arg = i.sas.pop()
        argTokens.push(arg)
    }

    i.sas.pop() //get rid of bal_sar

    let al_sar = new i.sar()
    al_sar.typeSar="al_sar"
    al_sar.params = argTokens
    i.sas.push(al_sar)
    
    //console.log(i.sas.value)
    
}