i = require("../semantic actions/iSemanticAction")

module.exports = function()
{

    let topSar = i.sas.top()
    let newQuad = new i.quad(i.insTypes.push, topSar, null, null, `${id_sar.value}`)

    i.quadProxy.push(newQuad)
}