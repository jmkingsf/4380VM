i = require("../semantic actions/iSemanticAction")

module.exports = function(jmpType)
{
    let prevQuad = i.quadProxy.pop()
    let prevToThatQuad = i.quadProxy.pop()
    if(prevToThatQuad.type == "JMP")
    {
        i.quadProxy.push(prevQuad)

    }else {
        i.quadProxy.push(prevQuad)
        i.quadProxy.push(prevToThatQuad)
    }
        
    

}