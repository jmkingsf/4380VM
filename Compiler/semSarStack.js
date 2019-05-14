module.exports = {
    value: [],
    top: function(){
        return this.value[this.value.length - 1]
    },
    push: function(record)
    {
        this.value.push(record)
    },
    pop: function()
    {
        // if(this.value.length == 0)
        //     console.log("stack is empty")
        return this.value.pop()
    }
}