let labelNum = 0;

module.exports = {
    insTypes: require("../iCode/instructionTypes"),
    symArray: require("../iCode/symArray"),
    insStack: require("../iCode/instructionTypeStack"),
    quadProxy: require("../iCode/quadArrayProxy"),
    quad: require("../iCode/quad"),
    labeler: require('../iCode/labeler'),
    sas: require("../semSarStack"),
    sos: require("../semOperatorStack"),
    sar: require("./semanticActionRecord"),
    symT: require("../SymbolTable"),
    sarT: require("./semanticActionRecords"),
    symData: require("../symbolData"),
    labeler: require("../iCode/labeler"),
    throwError: function(lineNum, objectInQuestion, error)
    {
        throw new Error(`#${token.lineNum} ${objectInQuestion} ${error}`)
    },
    addTemp: function(op1, op2, operator, overrideType)
    {
        var record;
        if(operator == "function")
        {
            record = new this.sar(`${op1.value}()`)
            this.sas.pop()
        } else if (operator == "variable" || operator == "constructor" || operator == "refVar") {
            record = new this.sar(`${op1.value}`)
            this.sas.pop()
        } else if (operator == "array") {
            record = new this.sar(`${op1.value}[${op2.value}]`)
            this.sas.pop()
        } else {
            record = new this.sar(op2.value + ` ${operator} ` + op1.value)
        }

        record.type = op1.type;
        if(overrideType)
            record.type = overrideType
        record.sarType = "tvar_sar"
        record.lineNum = op1.lineNum

        let symId;
        if(operator != "constructor" && operator != "refVar")
        {
            symId = this.symT.insert("temp", record.value, {"type": record.type})
        } else if(operator == "refVar") {
            symId = this.symT.insert("temp", record.value, {"type": record.type, "refVar": true})
        }else {
            symId = this.symT.insert("temp", record.value, {"type": record.type, "constructor": true})
        }
        record.symId = symId
        record.childTokens = [op1, op2]

        this.sas.push(record)
        return symId
    },
    mathSafe: function(lh, rh)
    {
        return  ((lh.type != rh.type) || ( lh.sarType != null && (lh.sarType.includes("lit")) || ( lh.prevSar != null && lh.prevSar.sarType != null && (lh.prevSar.sarType.includes("func"))))) && rh.value != "null"
    },
    invalidParams: function(symbol, sar)
    {
        //order, parity, and type
        let correctParity = symbol.data.parameters.length == sar.params.length
        if(!correctParity)
            return true
        let i = sar.params.length -1
        let correctOrderAndType = true;

        let t = 0
        for(t; t < sar.params.length; t++)
        {
            if(this.symT.table[symbol.data.parameters[t]].data.type != sar.params[i].type)
            {
                correctOrderAndType = false
                break
            }
            i--
        }
        return !(correctParity && correctOrderAndType)
    },
    validTruthStatement: function(op1, op2)
    {
        return op1.type != op2.type && op2.value != "null"
    },
    generateLabel: function()
    {
        labelNum += 1;
        return `${labelNum}`
    }
}