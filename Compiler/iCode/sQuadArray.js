qTypes = require("./instructionTypes")

module.exports = {
    value: {},
    push:function(quad) {
        if(quad.type != "COMMENT")
            this.value[this.currentKey].push(quad)
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
    print: function()
    {
        Object.keys(this.value).forEach((key) => {
            this.value[key].forEach(item =>{
                console.log(item)
            })
        })
    },
    length: function()
    {
        return this.value[this.currentKey].length
    },
    changeKey: function(key)
    {
        this.value[key] = []
        this.currentKey = key
    },
    currentKey: null,
    label: null
}