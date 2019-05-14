oStack = require('../semOperatorStack')
sar = require('./semanticActionRecord')
i = require("./iSemanticAction")

module.exports = function()
{
    //console.log("fired #,")
    while(oStack.top() != null && oStack.top().value != "(")
    {
        let operator = oStack.pop()
        operator.eval()
    }
    //console.log(i.sas.value)
    
}