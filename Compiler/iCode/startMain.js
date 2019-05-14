i = require("../semantic actions/iSemanticAction")


module.exports = function()
{
    i.quadProxy.switchToMQuadArray()
    let mainQuad = new i.quad(i.insTypes.startMain, null, null, null, `void kxi2019 main()`)
    mainQuad.op1 = {}
    mainQuad.op1.value = "main"
    i.quadProxy.push(mainQuad)

}