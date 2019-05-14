i = require("../semantic actions/iSemanticAction")


module.exports = function()
{
    let mainQuad = new i.quad(i.insTypes.endMain, null, null, null, `void kxi2019 main()`)
    mainQuad.op1 = {}
    mainQuad.op1.value = "main"
    i.quadProxy.push(mainQuad)

}