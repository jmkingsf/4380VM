i = require("./iSemanticAction")

module.exports = function()
{
    //console.log("fired func")
    let al_sar = i.sas.pop()
    let id_sar = i.sas.pop()

    let func_sar = new i.sar()
    func_sar.value = id_sar.value
    func_sar.type = id_sar.type
    func_sar.sarType = "func_sar"
    func_sar.params = al_sar.params
    i.sas.push(func_sar)

    //al_sar.params.
}

function isMatch(name, sym)
{
    return sym.value == name && sym.data.modifier == "public"
}