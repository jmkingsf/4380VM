

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
    },
    shuntSort: function()
    {
        let newArray = []
        //parentheses is lowest
        var i = 8;
        for(i; i > 0; i--)
        {
            this.value.forEach(item => {
                if(this.precedence[item.value] == i)
                    newArray.push(item)
            })
        }
        
        this.value = newArray
    },
    precedence:
    {
        "*":1,
        "/": 1,
        "+": 2,
        "-": 2,
        "<": 3,
        "<=": 3,
        ">" : 3,
        ">=": 3,
        "==": 4,
        "!=":4,
        "&&": 8,
        "||": 8,
        "=": 7,
        ")": 0,
        "]": 0
    }
}


/*
There will exist an array of items. Items are sorted until
the next parentheses. So if ( + - * ) are on my op
array.

I can just sort the very top each time. if * - exist on the stack
then - is put below, mult
*/