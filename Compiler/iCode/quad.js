module.exports = function(icodeType, op1, op2, op3, comment)
{
    this.type = icodeType
    this.op1 = op1
    this.op2 = op2
    this.op3 = op3
    this.comment = comment
    this.label = ""
    this.print = function()
    {  
        let opString = ""
        if(this.op1)
            opString = getOperatorInfo(this.op1)
        if(this.op2)
            opString +=" " + getOperatorInfo(this.op2)
        if(this.op3)
            opString += " "+ getOperatorInfo(this.op3)
        console.log(`${this.label} ${this.type} ${opString} ${this.comment}`)
    }
}

function getOperatorInfo(operator)
{
    if(operator)
    {
        if(operator.symId)
            return operator.symId
        
        return operator
    }
}