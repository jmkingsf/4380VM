oStack = require('../../semOperatorStack')
sar = require('../semanticActionRecord')

module.exports = function()
{
    //console.log("fired #)")
    let operator = oStack.pop()
    while(operator.value != "(")
    {
        operator.eval()
        operator = oStack.pop()
    }
    
   
    
}