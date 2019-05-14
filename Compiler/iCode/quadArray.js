qTypes = require("./instructionTypes")

module.exports = {
    value: [],
    push:function(quad) {
        this.value.push(quad)
    },
    pop: function()
    {
        return this.value.pop()
    },
    top: function()
    {
        return this.value[this.value.length-1]
    },
    clear: function()
    {
        this.value.length = 0
    },
    length: function()
    {
        return this.value.length
    },
    print: function()
    {
        this.value.forEach((item) => {
            item.print()
        })
    },
    label: null
}