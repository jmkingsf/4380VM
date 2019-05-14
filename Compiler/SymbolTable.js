const Symbol = require('./Symbol')
const fs = require('fs')
const SYM_TYPES = require("./SymTypes")

module.exports = {
    insert: function(kind, value, data)
    {
        if(kind == "temp")
        {
            let symId = this.generateSymId(kind)
            let symbol = new Symbol(this.getScope(), value, kind, data)
            symbol.key = symId

            symbol.offset = this.getSizeOfTempAndLocsForFunction(this.getScope())
            this.table[symId] = symbol
            this.keys.push(symId)

            this.length += 1
            return symId
        }

        if(!this.pass2){
            let symId = this.generateSymId(kind)

            if(data != null && data.kind != null && data.kind == "iLiteral"){
                this.table[symId] = new Symbol(this.scopeStack[0], value, kind, data)
            }else {
                let symbol = new Symbol(this.getScope(), value, kind, data)
                //isParam
                if(symId[0] == "p" || symId[0] == "l" || symId[0] == "h")
                {
                    symbol.offset = this.getSizeOfTempAndLocsForFunction(this.getScope())
                }

                this.table[symId] = symbol
            }

            this.keys.push(symId)
            this.length += 1
        
            return symId
        }
    },
    pass2: false,
    keys: [],
    table: {},
    generateSymId: function(kind)
    {
        this.currentNum += 1
        if(kind == "ivar")
        {
            kind = "heap"
        }

        return `${kind[0]}${this.currentNum}`
    },
    currentNum: 99,
    scopeStack: ["g"],
    getScope :function(){
        return this.scopeStack[this.scopeStack.length-1]
    },
    appendScope: function(name)
    {
        let prevScope = this.getScope()
        let newScope = prevScope + "." + name
        this.scopeStack.push(newScope)
        if(newScope == null)
        {
            throw new Error()
        }
        //console.log(newScope)
    },
    getSymsAtScope: function(scope)
    {
        //should return anything at current level and above it.
        let cScope;
        if(scope)
        {
            cScope = scope
        }else{
            cScope = this.getScope()
        }
        let tokensAtScope = []

        let i = 0
        for(i; i < this.keys.length; i++)
        {
            let key = this.keys[i]
            if(this.table[key].scope == cScope)
            {
                this.table[key].key = key
                tokensAtScope.push(this.table[key])
            }
        }
        // this.keys.forEach((key)=> {
        //     if(this.table[key].scope == cScope)
        //     {
        //         this.table[key].key = key
        //         tokensAtScope.push(this.table[key])
        //     }
                
        // })
    
        return tokensAtScope
    },
    getCurrentScopeToken: function(scope, globalT)
    {
        let lastScope;
        if(scope)
        {  
            lastScope = scope.split('.').pop()
        }else {
            lastScope = this.getScope().split('.').pop()
        }

        let cScope;
        if(globalT)
        {
            cScope = "g"
        }else {
            cScope = this.scopeStack[this.scopeStack.length - 2]
        }

        let syms = this.getSymsAtScope(cScope)
        return syms.find((sym)=> sym.value == lastScope)
    },
    getConstructor(name){
        let syms = this.keys.filter(key => key[0]=='x')
        let sym = syms.find((sym)=> this.table[sym].value == name)
        return this.table[sym]
    },
    popScope: function()
    {
        this.scopeStack.pop()
        //console.log("new scope is:", this.scopeStack[this.scopeStack.length-1])
    },
    length: 0,
    reset : function()
    {
        this.scopeStack = ["g"]
        this.currentNum = 99
        this.table = {}
        this.length = 0
    },
    contains : function(name)
    {
        //console.log(this.keys)
        for(var i in this.keys)
        {
            let key = this.keys[i]
            if(this.table[key].value == name)
                return true
        }
        return false
    },
    write: function(path)
    {
        fs.writeFileSync(path, JSON.stringify(this.table, null, 2) , 'utf-8');
    },
    getSymIdOfToken: function(name)
    {
        let syms = this.getSymsAtScope()
        let sym;
        syms.forEach((sym) => {
            if(sym.value == name)
                sym = sym.symId
        })

        return sym;
    },
    getSymIdOfToken2: function(name)
    {
        let scope = JSON.parse(JSON.stringify(i.symT.scopeStack))
        let found = false
        let sym;
        while(!found && scope.length > 0)
        {
            let cScope = scope.pop()
            let syms = symTable.getSymsAtScope(cScope)
            syms.forEach(item => {
                if(item.value == name )
                {
                    found = true
                    sym = item.key
                    return
                }
            })
        }
        return sym
    },
    getSizeOfTempAndLocsForFunction: function(scope)
    {
        let syms = this.getTempsAndLocsForFunction(scope)
        
        let size = syms.length * 4
        return size
    },
    getTempsAndLocsForFunction: function(scope)
    {
        let syms = this.getSymsAtScope(scope)
        syms = syms.filter(sym => sym.kind == "temp" || sym.kind == "lvar" || sym.kind == "param" || sym.kind == "ivar")
        
        return syms
    },
    getSizeOfLocsForClass: function(scope)
    {
        let syms = this.getLocsForClass(scope)
        
        let size = syms.length * 4
        return size
    },
    getLocsForClass: function(scope)
    {
        let syms = this.getSymsAtScope(scope)
        syms = syms.filter(sym => sym.kind == "lvar" || sym.kind == "ivar")
        
        return syms
    }
}