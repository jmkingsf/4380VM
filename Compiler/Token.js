module.exports = function (Lexeme, Type, lineNum){
    this.Lexeme = Lexeme
    this.Type = Type
    this.lineNum = lineNum

    if(Lexeme == "true" || Lexeme == "false")
        this.valueType = "bool"
}