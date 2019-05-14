i = require("./iSemanticAction")

module.exports = function()
{
   let bal_sar = new i.sar()
   bal_sar.sarType = "bal_sar"

   i.sas.push(bal_sar)
}