

module.exports.Types = {
    nonprintable_ascii : "nonprintable",
    number : "number",
    identifier: "identifier",
    character: "character",
    symbol: "symbol",
    punctuation: "punctuation",
    keyword: "keyword",
    comment: "comment",
    unknown: "unknown",
    EOF: "EOF"
}

module.exports.SymbolTypes = {
    math:"math",
    relational: "relational",
    boolean:"boolean",
    assignment:"assignment",
    arrayBegin:"arrayBegin",
    arrayEnd: "arrayEnd",
    blockBegin: "blockBegin",
    blockEnd: "blockEnd",
    parenthesesOpen: "parenthesesOpen",
    parenthesesClose: "parenthesesClose"
}

module.exports.keywords = {
    type:"type"
}


commentReg = /^\/\//
numReg = /^[0-9]+/;
identifierReg = /^[A-Za-z_][A-Za-z0-9_]*/
keywordReg = /^(atoi|and|bool|block|break|case|class|char|cin|cout|default|else|false|if|int|itoa|kxi2019|lock|main|new|null|object|or|public|private|protected|return|release|string|spawn|sym|set|switch|module.exports|true|thread|unprotected|unlock|void|while|wait)(?=[^a-z|A-Z|1-9])/
whiteSpaceOrSymbolReg = /^[\(\)\s<>=\[\]\-+]/
punctuationReg = /^[,;:.]/
characterReg = /^(['])(?:(?=(\\?))\2.){1}?\1/
symbolReg = /^[!\(\)|<>=\/\[\]\-+*&}{}]/
dobSymbolReg = /^[|!<>=&\/]{2}/

module.exports.DetermineType = function (curAnaly)
{
    //cleanAnaly(curAnaly);
    //number

    //beginning comment, wait till end of line

    

    if(commentReg.test(curAnaly.current))
    {
        curAnaly.current += " " + curAnaly.next;
        curAnaly.next = ""
        return [module.exports.Types.comment, curAnaly]
    } else if(numReg.test(curAnaly.current))
    {
        temp = curAnaly.current.match(numReg)[0]
        curAnaly.next = curAnaly.current.replace(numReg, '')
        curAnaly.current = temp;
        return [module.exports.Types.number, curAnaly]
    } else if(keywordReg.test(curAnaly.current))
    {
        temp = curAnaly.current.match(keywordReg)[0]
        curAnaly.next = curAnaly.current.replace(keywordReg, '')
        curAnaly.current = temp;

        return [module.exports.Types.keyword, curAnaly]
    } else if(identifierReg.test(curAnaly.current))
    {
        temp = curAnaly.current.match(identifierReg)[0]
        curAnaly.next = curAnaly.current.replace(identifierReg, '')
        curAnaly.current = temp;
        return [module.exports.Types.identifier, curAnaly]
    } else if(characterReg.test(curAnaly.current))
    {
        temp = curAnaly.current.match(characterReg)[0]
        curAnaly.next = curAnaly.current.replace(characterReg, '')
        curAnaly.current = temp;
        return [module.exports.Types.character, curAnaly]
    } else if(symbolReg.test(curAnaly.current))
    {
        if(dobSymbolReg.test(curAnaly.current))
        {
            temp = curAnaly.current.match(dobSymbolReg)[0]
            curAnaly.next = curAnaly.current.replace(dobSymbolReg, '')
            curAnaly.current = temp;
            return [getSymbolType(curAnaly.current), curAnaly]
        }
        temp = curAnaly.current.match(symbolReg)[0]
        curAnaly.next = curAnaly.current.replace(symbolReg, '')
        curAnaly.current = temp;
        return [getSymbolType(curAnaly.current), curAnaly]
    } else if(punctuationReg.test(curAnaly.current))
    {
        temp = curAnaly.current.match(punctuationReg)[0]
        curAnaly.next = curAnaly.current.replace(punctuationReg, '')
        curAnaly.current = temp;
        return [module.exports.Types.punctuation, curAnaly]
    }
    else{
        //make it so if there is a space, then the rest becomes next
        curAnaly.next = ""
        return [module.exports.Types.unknown, curAnaly]
    }
}

module.exports.SimplifyKeyword = (token) => {
    if(/int|char|bool|void|sym|class_name/.test(token.lexeme))
    {
        token.Type = this.keywords.type
        return
    }
}

function getSymbolType(lex)
{
    switch(lex)
    {
        case "[":
            return module.exports.SymbolTypes.arrayBegin
        case "]":
            return module.exports.SymbolTypes.arrayEnd
        case "(":
            return module.exports.SymbolTypes.parenthesesOpen
        case ")":
            return module.exports.SymbolTypes.parenthesesClose
        case "+":
            return module.exports.SymbolTypes.math
        case "-":
            return module.exports.SymbolTypes.math
        case "*":
            return module.exports.SymbolTypes.math
        case "/":
            return module.exports.SymbolTypes.math
        case "=":
            return module.exports.SymbolTypes.assignment
        case "{":
            return module.exports.SymbolTypes.blockBegin
        case "}":
            return module.exports.SymbolTypes.blockEnd
        case "==":
            return module.exports.SymbolTypes.boolean
        case "!=":
            return module.exports.SymbolTypes.boolean
        case "<":
            return module.exports.SymbolTypes.boolean
        case "<=":
            return module.exports.SymbolTypes.boolean
        case ">=":
            return module.exports.SymbolTypes.boolean
        case ">":
            return module.exports.SymbolTypes.boolean
        case "&&":
            return module.exports.SymbolTypes.relational
        case "||":
            return module.exports.SymbolTypes.relational
        default:
            return module.exports.Types.unknown
    }
}