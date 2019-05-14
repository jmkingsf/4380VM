oStack = require('../semOperatorStack')
sar = require('./semanticActionRecord')
i = require("./iSemanticAction")

module.exports = function(token)
{
    //console.log("fired eoe")
    let operator = oStack.pop()
    while(operator != null)
    {
        //console.log(operator)
    
        operator.eval()
        operator = oStack.pop()
    }

    while(i.sas.top() != null)
    {
        i.sas.pop()
    }
   
    i.symArray.clear()
}