var typifier = require('./LexicalIdent')
readLineSync = require('./readLineSync')
Token = require('./Token')

var File;
var NextLine;
var LineNum = 1;
var currentAnaly = new Analy("", "")

function Analy(current, next)
{
    this.current = current
    this.next = next
}

module.exports.Initialize = (fileName) =>
{
    OpenFile(fileName);
}

function OpenFile(fileName)
{
    currentAnaly = new Analy("", "")
    File = require('./readLineSync')(fileName)
    LineNum = 0
    SetNextLine()
}

quad = require("./iCode/quad")
insTypes = require("./iCode/instructionTypes")
quadProxy = require("./iCode/quadArrayProxy")
function SetNextLine()
{
    do{
        LineNum += 1
        NextLine = { obj: File.next(), lineNum: LineNum}
        NextLine.done = NextLine.obj.done;
        NextLine.value = NextLine.obj.value;
    }while(!NextLine.done && (NextLine.value == "" || NextLine.value.replace(/\s/g,'').length == 0))
    let newQuad = new quad(insTypes.comment,NextLine.value , null, null, ``)
    quadProxy.push(newQuad)    

    return !NextLine.done
}
module.exports.CurrentToken = null
module.exports.PreviousToken = null
module.exports.Next = null;

module.exports.GetNextToken = () =>
{   
    if(this.Next)
    {
        this.CurrentToken = this.Next
        this.Next = null
        return this.CurrentToken
    }
    this.PreviousToken = this.CurrentToken
    currentAnaly = SetupNext(currentAnaly);

    if(currentAnaly == "EOF")
    {
        token = new Token("EOF", "EOF", LineNum)
        this.CurrentToken = token
        return token
    }
    
    if(currentAnaly.current.includes("debug;"))
    {
        debugger
        currentAnaly = SetupNext(currentAnaly);
    }

    

    returnVal = typifier.DetermineType(currentAnaly) 


    type = returnVal[0]
    currentAnaly = returnVal[1]
    token = new Token(currentAnaly.current ,type, LineNum)
    if(token.Type == typifier.Types.comment)
        return this.GetNextToken()
    if(!token)
        throw new Error("undefined token")
    this.CurrentToken = token;
    return token
}

function SetupNext(currentAnaly)
{
    if(currentAnaly.next != "" && currentAnaly.next != null)
    {
        currentAnaly.next = currentAnaly.next.trim()
        currentAnaly.current = currentAnaly.next;
        currentAnaly.next = null
        return currentAnaly
    }

    if(currentAnaly.next == null)
    {
        return "EOF"
    }

    if((currentAnaly.next == "" && currentAnaly.current != "") || currentAnaly.next == typifier.Types.comment)
    {
        if(currentAnaly.next != "" && currentAnaly.next != typifier.Types.comment)
        {
            return new Analy(currentAnaly.next, "")
        }
        if(!SetNextLine())
            return "EOF"
    }

    NextLine.value = NextLine.value.trim()
    

    return new Analy(NextLine.value, "")
}