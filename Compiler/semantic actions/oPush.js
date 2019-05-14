oStack = require('../semOperatorStack')
sar = require('./semanticActionRecord')

module.exports = function(currentToken) {
    //console.log("Fired oPush")
    //console.log(currentToken)
    let record = new sar(currentToken.Lexeme);
    //console.log(name)
    record.type = "oPush"
    record.eval = evaluations[currentToken.Lexeme]

    //if What I'm pushing on has higher precendence, run top
    while(oStack.top() != null && oStack.precedence[record.value] >= oStack.precedence[oStack.top().value] && oStack.top().value != "(")
    {
        let operator = oStack.pop()
        operator.eval()
    }

    
    oStack.push(record)
    return true
}

evaluations = 
{
    "*": require("./operators/mult"),
    "/": require("./operators/div"),
    "+": require("./operators/add"),
    "-": require("./operators/sub"),
    "<": require("./operators/lessThan"),
    "<=": require("./operators/lessThanEqual"),
    ">" : require("./operators/greaterThan"),
    ">=": require("./operators/greaterThanEqual"),
    "==": require("./operators/dEqual"),
    "!=":require("./operators/notEqual"),
    "&&": require("./operators/and"),
    "||": require("./operators/or"),
    "=": require("./operators/equals"),
}