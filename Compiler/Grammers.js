const ident = require('./LexicalIdent').Types
const symbolTypes = require('./LexicalIdent').SymbolTypes
// const types = { statement: "statement", expression: "expression", expressionz: "expressionz", assignmentExpression: "assignmentExpression"}
const SymTypes = require('./SymTypes')
let types = {int:"int", char:"char", bool:"bool", void:"void", sym:"sym"}
let output = process.stdout;
let symbolData = require("./symbolData")
let semanticActions = require("./semantic actions/semanticActions")
let pass2 = false;
let revertPass2 = false

let curLabel;

module.exports = {
    init: function()
    {
        semanticActions.forEach((item) => {
            let name = item.name
            this[name] = function(data)
            {
                if(module.exports.pass2())
                {
                        item.value(data)
                } 
            }
        })
    },
    debug: false,
    pass2: function(value){
        if(value)
        {
            pass2 = value
            this.SymbolTable.pass2 = true;
        }
        
        return pass2
    },
    SetOutput: function(stream){
        output = stream;
    },
    SymbolTable: require('./SymbolTable'),
    Statement: function(token, LexAnal){
        switch(token.Lexeme)
        {
            case "if":
                this.beginIf()
                if(LexAnal.GetNextToken().Lexeme != "(")
                    throwError("(", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.oPush(LexAnal.CurrentToken)
                this.Expression(LexAnal.GetNextToken(), LexAnal)
                if(LexAnal.CurrentToken.Lexeme != ")")
                    throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.eParen()
                this.if(LexAnal.CurrentToken)
                this.Statement(LexAnal.GetNextToken(), LexAnal)
                this.JMP("if")

                if(LexAnal.CurrentToken.Lexeme == "else")
                {
                    this.isElse()

                    this.Statement(LexAnal.GetNextToken(), LexAnal)

                    this.isElseEnd()

                    //this.depositLabel()
                }

                this.endIf()

                return
            case "while":
                if(LexAnal.GetNextToken().Lexeme != "(")
                    throwError("(", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

                statementType = "while"
                this.beginWhile()
                this.oPush(LexAnal.CurrentToken)
                this.Expression(LexAnal.GetNextToken(), LexAnal)
                statementType = null
                if(LexAnal.CurrentToken.Lexeme != ")")
                    throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.eParen()
                this.while(LexAnal.CurrentToken)
                this.Statement(LexAnal.GetNextToken(), LexAnal)
                this.JMP("while")
                return
            case "return":
                if(isExpression(LexAnal.GetNextToken(), LexAnal))
                    this.Expression(LexAnal.CurrentToken, LexAnal)
                if(LexAnal.CurrentToken.Lexeme != ";")
                    throwError(";", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.return("func")
                break
            case "cout":
                LexAnal.GetNextToken()
                if(LexAnal.CurrentToken.Lexeme != "<<")
                    throwError("<<", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.Expression(LexAnal.GetNextToken(), LexAnal)
                if(LexAnal.CurrentToken.Lexeme != ";")
                    throwError(";", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.cout(LexAnal.CurrentToken)
                break
            case "cin":
                LexAnal.GetNextToken()
                if(LexAnal.CurrentToken.Lexeme != ">>")
                    throwError(">>", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.Expression(LexAnal.GetNextToken(), LexAnal)
                if(LexAnal.CurrentToken.Lexeme != ";")
                    throwError(";", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.cin(LexAnal.CurrentToken)
                break
            case "switch":
                if(pass2)
                {
                    revertPass2 = true
                    pass2 = false
                }
                LexAnal.GetNextToken()
                if(LexAnal.CurrentToken.Lexeme != "(")
                    throwError("(", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.Expression(LexAnal.GetNextToken(), LexAnal)
                if(LexAnal.CurrentToken.Lexeme != ")")
                    throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                this.caseBlock(LexAnal.GetNextToken(), LexAnal)
                
                if(revertPass2)
                {
                    pass2 = true
                }
                break;
            case "break":
                LexAnal.GetNextToken();
                if(LexAnal.CurrentToken.Lexeme != ";")
                    throwError(";", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                break;
            case "{":
                LexAnal.GetNextToken()
                while(isStatement(LexAnal.CurrentToken))
                    this.Statement(LexAnal.CurrentToken, LexAnal)
                if(LexAnal.CurrentToken.Lexeme != "}")
                    throwError("}", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                //this.depositLabel()
                break;
            default:
                if(!isExpression(token))
                {
                    throwError("statement", token.Lexeme, token)
                }
                this.Expression(token, LexAnal)
                if(LexAnal.CurrentToken.Lexeme != ";"){
                    throwError(";", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                }
                this.eOE()
                break;
        }

        LexAnal.GetNextToken()
    },
    Literal: function(LexAnal)
    {
        let data = new symbolData()
        // if(LexAnal.PreviousToken.Lexeme == "+" || LexAnal.PreviousToken.Lexeme == "-")
        // {
        //     LexAnal.CurrentToken.Lexeme = LexAnal.PreviousToken.Lexeme + LexAnal.CurrentToken.Lexeme
        // }

        if(LexAnal.CurrentToken.Type == ident.character)
        {
            data.type = "char"
            data.kind = "iLiteral"
            this.SymbolTable.insert("char", LexAnal.CurrentToken.Lexeme, data)
            LexAnal.CurrentToken.valueType = "char"
            this.lPush(LexAnal.CurrentToken)
        }

        if(LexAnal.CurrentToken.Type == ident.number)
        {
            data.type = "int"
            data.kind = "iLiteral"
            this.SymbolTable.insert("int", LexAnal.CurrentToken.Lexeme, data)
            LexAnal.CurrentToken.valueType = "int"
            this.lPush(LexAnal.CurrentToken)
        }

        if(LexAnal.CurrentToken.Type != ident.number && LexAnal.CurrentToken.Type != ident.character)
            throwError("literal", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        
        LexAnal.GetNextToken()
    },
    CaseLabel: function(LexAnal)
    {
        if(!isCaseLabel(LexAnal.CurrentToken))
            throwError("case", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        
        LexAnal.GetNextToken()
        this.Literal(LexAnal)
        if(LexAnal.CurrentToken.Lexeme != ":")
            throwError(":", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

        this.Statement(LexAnal.GetNextToken(), LexAnal)
    },
    caseBlock:function(token, LexAnal)
    {
        if(LexAnal.CurrentToken.Lexeme != "{")
            throwError("{", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        LexAnal.GetNextToken()

        while(isCaseLabel(LexAnal.CurrentToken))
        {
            this.CaseLabel(LexAnal)
        }

        if(LexAnal.CurrentToken.Lexeme != "}")
            throwError("}", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)


    },
    Expression: function(token, LexAnal)
    {
        switch(LexAnal.CurrentToken.Lexeme)
        {
            case "true":
                this.lPush(LexAnal.CurrentToken)
                LexAnal.GetNextToken()
                maybeExpressionZ(LexAnal.CurrentToken, LexAnal)
                break;
            case "false":
                this.lPush(LexAnal.CurrentToken)
                LexAnal.GetNextToken()
                maybeExpressionZ(LexAnal.CurrentToken, LexAnal)
                break;
            case "null":
                this.lPush(LexAnal.CurrentToken)
                LexAnal.GetNextToken()
                maybeExpressionZ(LexAnal.CurrentToken, LexAnal)
                break;
            case "this":
                this.iPush(LexAnal.CurrentToken)
                this.iExist()

                LexAnal.GetNextToken()
                if(isMemberRefs(LexAnal.CurrentToken))
                {
                    this.MemberRefs(LexAnal.CurrentToken, LexAnal)
                }
                maybeExpressionZ(LexAnal.CurrentToken, LexAnal)
                break;
            default:
                if(isLiteral(token))
                {
                    if(token.Type == symbolTypes.math)
                    {
                        LexAnal.GetNextToken()
                        LexAnal.CurrentToken.Lexeme = LexAnal.PreviousToken.Lexeme + LexAnal.CurrentToken.Lexeme
                    }
                    if(LexAnal.CurrentToken.Type == ident.number)
                    {
                        this.Literal(LexAnal)
                        if(this.IsExpressionZ(LexAnal.CurrentToken)){
                            this.ExpressionZ(LexAnal.CurrentToken, LexAnal)
                        }
                        return 
                    }
                    

                    if(LexAnal.CurrentToken.Type == ident.character)
                    {
                        this.Literal(LexAnal)
                        if(this.IsExpressionZ(LexAnal.CurrentToken)){
                            this.ExpressionZ(LexAnal.CurrentToken, LexAnal)
                        }
                        return
                    }
                }
                
                if(token.Type == ident.identifier)
                {
                    if(token != LexAnal.CurrentToken)
                    {
                        nextToken = LexAnal.CurrentToken
                    }else {
                        nextToken = LexAnal.GetNextToken();
                    }
                    this.iPush(token)
                    let tokType = "variable"
                    if(isFunctionArrayMember(nextToken))
                        tokType = this.FunctionArrayMember(nextToken, LexAnal)
                    this.iExist(tokType)
                    if(isMemberRefs(LexAnal.CurrentToken))
                        this.MemberRefs(LexAnal.CurrentToken, LexAnal)
                    if(this.IsExpressionZ(LexAnal.CurrentToken)){
                        this.ExpressionZ(LexAnal.CurrentToken, LexAnal)
                    }

                    return
                }
                if(token.Lexeme == "(")
                {
                    this.Expression(LexAnal.GetNextToken(), LexAnal)
                    if(LexAnal.CurrentToken.Lexeme != ")")
                        throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                    LexAnal.GetNextToken()
                    while(this.IsExpressionZ(LexAnal.CurrentToken))
                    {
                        this.ExpressionZ(LexAnal.CurrentToken, LexAnal)
                    }
                    return
                }
                throwError("expression", token.Lexeme, token)
            
        }
        
    },
    ExpressionZ: function(token, LexAnal) {
        if(token.Lexeme == "="){
            this.oPush(token)
            this.AssignmentExpression(LexAnal.GetNextToken(), LexAnal)
            return
        }

        if(token.Type == symbolTypes.boolean || token.Type == symbolTypes.math || token.Type == symbolTypes.relational)
        {
            if(token.Type == symbolTypes.boolean)
                this.isBool()
            this.oPush(token)
            this.Expression(LexAnal.GetNextToken(), LexAnal)
            return
        }
        throw new Error("hi")
    },
    FunctionArrayMember: function(token, LexAnal)
    {
        if(token.Lexeme == "(")
        {
            this.oPush(token)
            this.beginArguementList()
            this.ArguementList(LexAnal.GetNextToken(), LexAnal)
            if(LexAnal.CurrentToken.Lexeme != ")")
                throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            this.eParen()
            this.EAL()
            this.func()
            LexAnal.GetNextToken()
            return "function"
        }
        else if(token.Lexeme == "[")
        {
            this.oPush(token)
            this.Expression(LexAnal.GetNextToken(), LexAnal)
            if(LexAnal.CurrentToken.Lexeme != "]")
                throwError("]", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken()
            this.eBracket()
            this.arr()
            return "array"
        }
        else 
        {
            throwError("FunctionArrayMember", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        }
    },
    MemberRefs: function(token, LexAnal)
    {
        if(token.Lexeme != ".")
            throwError(".", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        if(LexAnal.GetNextToken().Type != ident.identifier)
            throwError("identifier", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

        this.iPush(LexAnal.CurrentToken)

        tokType = "variable"
        if(isFunctionArrayMember(LexAnal.GetNextToken()))
            tokType = this.FunctionArrayMember(LexAnal.CurrentToken, LexAnal)
        
        this.rExist(tokType)


        if(isMemberRefs(LexAnal.CurrentToken))
            this.MemberRefs(LexAnal.CurrentToken, LexAnal)

    },
    IsExpressionZ: function(nextToken){
        switch(nextToken.Lexeme)
        {
            case "=":
                return true
            case "+":
                return true
            case "-":
                return true
            case "*":
                return true
            case "<":
                return true
            case "/":
                return true
            default:
                switch(nextToken.Type)
                {
                    case symbolTypes.relational:
                        return true;
                    case symbolTypes.boolean:
                        return true;
                }
        }
    },
    ArguementList: function(token, LexAnal)
    {
        while(isExpression(LexAnal.CurrentToken))
        {
            this.Expression(LexAnal.CurrentToken, LexAnal)
            if(LexAnal.CurrentToken.Lexeme != ",")
                break;
            this.coma()
            LexAnal.GetNextToken()
        }
    },
    NewDeclaration: function(token, LexAnal) {
        if(token.Lexeme == "(")
        {
            this.oPush(token)
            this.beginArguementList()
            if(isArguementList(LexAnal.GetNextToken()))
                this.ArguementList(LexAnal.CurrentToken, LexAnal)
    
            if(LexAnal.CurrentToken.Lexeme != ")")
                throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            this.eParen()
            this.EAL()
            this.newObj()
            LexAnal.GetNextToken()
        }else if(token.Lexeme == "[")
        {
            this.oPush(token)
            this.Expression(LexAnal.GetNextToken(), LexAnal)
            if(LexAnal.CurrentToken.Lexeme != "]")
                throwError("]", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            this.eBracket()
            this.newArr()
            LexAnal.GetNextToken()
        }
        else 
        {
            throwError("new declaration", token.Lexeme, token)
        }
            
    },
    AssignmentExpression: function(token, LexAnal) {
        if(isExpression(token))
        {
            this.Expression(token, LexAnal)
            return;
        }

        if(token.Lexeme == "new")
        {
            if(!isType(LexAnal.GetNextToken()))
                throwError("type", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            this.tPush(LexAnal.CurrentToken)
            this.NewDeclaration(LexAnal.GetNextToken(), LexAnal)
            return;
        }

        if(token.Lexeme == "atoi")
        {
            if(LexAnal.GetNextToken().Lexeme != "(")
                throwError("(", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            this.Expression(LexAnal.GetNextToken(), LexAnal)
            if(LexAnal.CurrentToken.Lexeme != ")")
                throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken()
            return;
        }

        if(token.Lexeme == "itoa")
        {
            if(LexAnal.GetNextToken().Lexeme != "(")
                throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            this.Expression(LexAnal.GetNextToken(), LexAnal)
            if(LexAnal.CurrentToken.Lexeme != ")")
                throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken()
            return
        }

        throwError("expression", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
    },
    Error: function(expecting, actual)
    {
        return `Expected ${expecting} actual ${actual}`
    },
    Class: function(token, LexAnal)
    {
        let memberSymbols = []

        if(token.Lexeme != "class")
        {
            throwError("class", token.Lexeme, token)
        }
        nextToken = LexAnal.GetNextToken()
        if(nextToken.Type != ident.identifier)
        {
            throwError("identifier", nextToken.Lexeme, nextToken)
        }
        this.dup([nextToken, nextToken.Lexeme, "Class"])
        this.newClassInitialization(nextToken)
        data = new symbolData();
        data.modifier = "public"
        data.type = nextToken.Lexeme
        this.SymbolTable.insert(SymTypes.class, nextToken.Lexeme, data)
        this.SymbolTable.appendScope(nextToken.Lexeme)
        //types[nextToken.Lexeme]= nextToken.Lexeme
        if(LexAnal.GetNextToken().Lexeme != "{")
        {
            throwError("{", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        }
        LexAnal.GetNextToken()
        while(isClassMemberDec(LexAnal.CurrentToken))
        {
            let symId = this.ClassMemberDec(LexAnal.CurrentToken, LexAnal)
            memberSymbols.push(symId)
        }

        if(LexAnal.CurrentToken.Lexeme != "}")
            throwError("}", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        LexAnal.GetNextToken()

        this.iCalculateClassSize()
        this.SymbolTable.popScope()
    },
    types: types,
    ClassMemberDec: function(token, LexAnal)
    {
        let modifier;
        let type;
        let name;
        let symId;

        if(!isModifier(token) && !isConstructor(token))
            throwError("constructor or modifier", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        if(isModifier(token))
        {
            modifier = token.Lexeme

            LexAnal.GetNextToken()
            if(!isType(LexAnal.CurrentToken))
                throwError("type", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

            type = LexAnal.CurrentToken.Lexeme
            this.tPush(LexAnal.CurrentToken)
            this.tExist(LexAnal.CurrentToken)


            LexAnal.GetNextToken()
            if(LexAnal.CurrentToken.Type != ident.identifier)
                throwError("identifier", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

            name = LexAnal.CurrentToken.Lexeme

            data = new symbolData()
            data.type = type
            data.modifier = modifier
            data.name = name
            this.FieldDec(LexAnal.GetNextToken(), LexAnal, data, LexAnal.PreviousToken)
        } else if(isConstructor(token))
        {
            this.Constructor(token, LexAnal)
        } else{
            throwError("constructor or modifier", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        }

        
    },
    Constructor: function(token, LexAnal)
    {
        let name;
        let params = []
        let returntype;
        name = token.Lexeme
        returntype = token.Lexeme

        this.cd(token)
        this.dup([token, returntype,"function"])

        this.sConstructor(token)
        this.SymbolTable.appendScope(name)

        if(!isConstructor(token))
            throwError("class_name", token.Lexeme, token)

        if(LexAnal.GetNextToken().Lexeme != "(")
            throwError("(", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        
        LexAnal.GetNextToken()
        
        let data = new symbolData()
        data.returntype = returntype;
        data.type = returntype;
        data.modifier = "public"
        let parameters = this.ParameterList(LexAnal.CurrentToken, LexAnal)
        data.parameters = parameters
        this.SymbolTable.popScope()
        this.SymbolTable.insert("xConstructor", name, data)
        this.SymbolTable.appendScope(name)

        if(LexAnal.CurrentToken.Lexeme != ")")
            throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        
        this.iFunc(name)
        this.MethodBody(LexAnal.GetNextToken(), LexAnal, "constructor")
        this.endiFunc()
    },
    FieldDec: function(token, LexAnal, decDetails, identToken)
    {
        let symId;

        //one option
        if(token.Lexeme == "(")
        {
            //could have return symid
            decDetails.returntype = decDetails.type
            this.dup([identToken, decDetails.returntype, "function"])
            this.SymbolTable.appendScope(decDetails.name)
            let parameters = this.ParameterList(LexAnal.GetNextToken(), LexAnal)
            decDetails.parameters = parameters


            this.SymbolTable.popScope()
            this.SymbolTable.insert("method", decDetails.name, decDetails)
            if(LexAnal.CurrentToken.Lexeme != ")")
                throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

            this.SymbolTable.appendScope(decDetails.name)

            this.iFunc(decDetails.name)
            this.MethodBody(LexAnal.GetNextToken(), LexAnal, "func")
            this.endiFunc()
        }else {
            //is variable
            if(token.Lexeme == "[")
            {
                LexAnal.GetNextToken()
                if(LexAnal.CurrentToken.Lexeme != "]")
                    throwError("]", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
                LexAnal.GetNextToken()

                decDetails.type = "@:" + decDetails.type
            }


            this.SymbolTable.insert("ivar", decDetails.name, data)
            this.dup([identToken, decDetails.type, "variable"])

            identToken.valueType = decDetails.type
            this.vPush(identToken)
    
            if(LexAnal.CurrentToken.Lexeme == "=")
            {
                this.oPush(LexAnal.CurrentToken)
                this.AssignmentExpression(LexAnal.GetNextToken(), LexAnal)
            }
            
            if(LexAnal.CurrentToken.Lexeme != ";")
                throwError(";", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken()

            this.eOE()
            return symId
        } 
    },
    ParameterList: function(token, LexAnal)
    {
        let paramNames = []
        while(isParameter(LexAnal.CurrentToken))
        {
            let paramName = this.Parameter(LexAnal.CurrentToken, LexAnal)
            paramNames.push(paramName)

            if(LexAnal.CurrentToken.Lexeme == ")")
            {
                continue
            }

            if(LexAnal.CurrentToken.Lexeme != ",")
            {
                throwError(",", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            }
            LexAnal.GetNextToken()
        }

        return paramNames
    }, 
    Parameter: function(token, LexAnal)
    {
        let value;
        let type;


        if(!isParameter(token))
            throwError("identifer", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

        type = LexAnal.CurrentToken.Lexeme
        this.iPush(LexAnal.CurrentToken)
        this.tExist(LexAnal.CurrentToken)
        
        LexAnal.GetNextToken()
        if(LexAnal.CurrentToken.Type != ident.identifier)
            throwError("identifer", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

        value = LexAnal.CurrentToken.Lexeme
        valToken = LexAnal.CurrentToken

        LexAnal.GetNextToken()
        if(LexAnal.CurrentToken.Lexeme == "[")
        {
            type = "@:" + type
            LexAnal.GetNextToken()
            if(LexAnal.CurrentToken.Lexeme != "]")
                throwError("]", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

            LexAnal.GetNextToken()
        }

        this.dup([valToken, type, "variable"])
        data = new symbolData()
        data.type = type
        data.modifier = "private"
        let symId = this.SymbolTable.insert("param", value, data)

        
        return symId
    },
    MethodBody: function(token, LexAnal, methodType)
    {
        if(token.Lexeme != "{")
            throwError("{", token.Lexeme, token)

        LexAnal.GetNextToken()
        while(isVariableDec(LexAnal.CurrentToken))
        {
            LexAnal.GetNextToken()
            if(LexAnal.CurrentToken.Type != ident.identifier)
            {
                LexAnal.Next = LexAnal.CurrentToken
                LexAnal.CurrentToken = LexAnal.PreviousToken
                break;
            }
                
            this.VariableDec(LexAnal.PreviousToken, LexAnal)
            continue;
        }

        if(isStatement(LexAnal.CurrentToken))
        {
            do
            {
                this.Statement(LexAnal.CurrentToken, LexAnal)
            }while(isStatement(LexAnal.CurrentToken))
        }

        
        if(isType(LexAnal.CurrentToken))
            throwError("variable declaration", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            
        
        if(LexAnal.CurrentToken.Lexeme !="}")
            throwError("}", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

        LexAnal.GetNextToken()
        this.return(methodType)
        this.SymbolTable.popScope()

    },
    VariableDec: function(token, LexAnal)
    {
        let value;
        let type;

        if(!isType(token))
            throwError("type declaration", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

        type = token.Lexeme
        this.tPush(token)
        this.tExist(token)
        //LexAnal.GetNextToken()
        if(LexAnal.CurrentToken.Type != ident.identifier)
            throwError("identifier", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

        

        value = LexAnal.CurrentToken.Lexeme
        let valueToken = LexAnal.CurrentToken
        LexAnal.GetNextToken()

        if(LexAnal.CurrentToken.Lexeme == "[")
        {
            LexAnal.GetNextToken();
            if(LexAnal.CurrentToken.Lexeme != "]")
                throwError("]", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)

            type = "@:" + type
            LexAnal.GetNextToken();
        }
        this.dup([valueToken, type, "variable"])

        valueToken.type = type
        this.vPush(valueToken)
        data = new symbolData()
        data.modifier = "private"
        data.type = type;
        this.SymbolTable.insert("lvar", value, data)

        if(LexAnal.CurrentToken.Lexeme == "=" )
        {
            this.oPush(LexAnal.CurrentToken)
            this.AssignmentExpression(LexAnal.GetNextToken(), LexAnal)
        }

        if(LexAnal.CurrentToken.Lexeme != ";")
        {
            throwError(";", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
        }
        this.eOE()
        LexAnal.GetNextToken()
    },
    Start: function(token, LexAnal)
    {
        try {
            this.SymbolTable.insert("type", "int")
            this.SymbolTable.insert("type", "char")
            this.SymbolTable.insert("type", "bool")
            this.SymbolTable.insert("type", "void")
            this.SymbolTable.insert("type", "sym")
            this.SymbolTable.insert("bool", "true")
            this.SymbolTable.insert("bool", "false")
            this.SymbolTable.insert("int", "null")



            while(isClassDec(LexAnal.CurrentToken))
            {
                this.Class(LexAnal.CurrentToken, LexAnal)
            }
    
            this.startMain()
            data = new symbolData()
            data.returntype = "void"
            this.SymbolTable.insert("fMain", "main", data)
            if(LexAnal.CurrentToken.Lexeme != "void")
                throwError("void", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken();
            if(LexAnal.CurrentToken.Lexeme != "kxi2019")
                throwError("kxi2019", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken()
            if(LexAnal.CurrentToken.Lexeme != "main")
                throwError("main", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken()
            if(LexAnal.CurrentToken.Lexeme != "(")
                throwError("(", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            LexAnal.GetNextToken()
            if(LexAnal.CurrentToken.Lexeme != ")")
                throwError(")", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            
            this.SymbolTable.appendScope("main")
            this.MethodBody(LexAnal.GetNextToken(), LexAnal,  "main")

            if(LexAnal.CurrentToken.Lexeme != "EOF")
            {
                throwError("EOF", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
            }

            this.endMain()
        }catch (exception){
            if(module.exports.debug)
            {
                console.log(LexAnal.CurrentToken.lineNum)
                throw exception
            }
            return exception.message;
        }
        
    }
}

isModifier = function(token)
{
    return token.Lexeme == "public" || token.Lexeme == "private"
}

isType = function(token)
{
    return isParameter(token);
}

isParameter = function(token)
{
    return (token.Type == ident.identifier || types[token.Lexeme]!= null)
}

isStatement = function(token)
{
    switch(token.Lexeme)
    {
        case "if":
            return true;
        case "while":
            return true
        case "return":
            return true
        case "cout":
            return true
        case "cin":
            return true
        case "switch":
            return true
        case "break":
            return true
        case "{":
            return true
        default:
            return isExpression(token)
    }
    
}

isExpression = function(token)
{
    switch(token.Lexeme)
    {
        case "(":
            return true
        case "true":
            return true
        case "false":
            return true
        case "null":
            return true
        case "this":
            return true
        default:
            return isLiteral(token) | token.Type == ident.identifier
    }
}

isVariableDec = function(token)
{
    return isParameter(token)
}

throwError = function(expected, actual, token)
{
    throw new Error(`#${token.lineNum} found ${actual} expecting ${expected}`)
}

isClassDec = function(token)
{
    return token.Lexeme == "class"
}

isClassMemberDec = function(token)
{
    return isModifier(token) || isConstructor(token)
}

isConstructor = function(token)
{
    return token.Type == ident.identifier
}

isCaseLabel = function(token)
{
    return token.Lexeme == "case"
}

isLiteral = function(token)
{
    return (token.Lexeme == "+" || token.Lexeme == "-" || token.Type == ident.character || token.Type == ident.number)
    
    // if(LexAnal.CurrentToken.Type != ident.number || LexAnal.CurrentToken.Type != ident.number)
    //     throwError("literal", LexAnal.CurrentToken.Lexeme, LexAnal.CurrentToken)
}

isMemberRefs = function(token)
{
    return token.Lexeme == "."
}

isFunctionArrayMember = function(token)
{
    return token.Lexeme == "(" || token.Lexeme == "["
}

isArguementList = function(token)
{
    return isExpression(token);
}

maybeExpressionZ = function(token, LexAnal){
    if(module.exports.IsExpressionZ(token))
        module.exports.ExpressionZ(token, LexAnal)
}

//get a token,