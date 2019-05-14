i = require("../semantic actions/iSemanticAction")

module.exports = function()
{
    let syms = i.symT.getSymsAtScope()
    let size = 0
    syms.forEach((sym) => {
        if(sym.kind == "ivar")
        {
            size += 4
        }
    })

    setCurrentClassSize(size)
}


function setCurrentClassSize(size)
{
    let sym = i.symT.getCurrentScopeToken()
    sym.size = size;
}