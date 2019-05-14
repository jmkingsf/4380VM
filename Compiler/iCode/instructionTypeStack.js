insTypes = require("./instructionTypes")

module.exports = {
    value: [],
    push:function(instructionType) {
        if(insTypes[instructionType] == null)
            throw new Error ("instruction does not exist")
        this.value.push(instructionType)
    },
    clear: function()
    {
        this.value.length = 0
    }
}