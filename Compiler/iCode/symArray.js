module.exports = {
    value: [],
    push:function(symbol) {
        this.value.push(symbol)
    },
    clear: function()
    {
        this.value.length = 0
    }
}