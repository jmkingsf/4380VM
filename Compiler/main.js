var lexAnal = require("./lexicalAnalyzer")
var fs = require("fs")
var synAnal = require("./SyntaxAnalyzer")
var iCodeArray = require("./iCode/quadArrayProxy")
var TCodeGenerator = require("./TCodeGenerator")


function writeTokens(tokens)
{
    var data = "";
    tokens.forEach(function(token){
        data += token.lineNum + "\t" + token.Lexeme + "\t" + token.Type + "\n"
    })
    fs.writeFile('output.txt', data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
}

function main()
{
    lexAnal.Initialize(process.argv.slice(2)[0]);
    global.myTokens = [];
    do{
        var nextToken = lexAnal.GetNextToken();
        myTokens.push(nextToken);
        outputString = nextToken.lineNum + "\t" + nextToken.Lexeme + "\t" + nextToken.Type
        console.log(outputString)

    }while(nextToken.Lexeme != "EOF")

    //printTokens(myTokens);
    writeTokens(myTokens)
}

function main2()
{
    lexAnal.Initialize(process.argv.slice(2)[0])
    synAnal.ProcessDocument()
    lexAnal.Initialize(process.argv.slice(2)[0])
    synAnal.ProcessDocument()
    //iCodeArray.print()
    TCodeGenerator.start()
    //TCodeGenerator.printToConsole()
    TCodeGenerator.writeToFile()


}

function main3()
{
    lexAnal.Initialize(process.argv.slice(2)[0])
    synAnal.ProcessDocument()
    lexAnal.Initialize(process.argv.slice(2)[0])
    synAnal.ProcessDocument()
}

function printTokens(tokens)
{

    prevLineNum = 0
    tokens.forEach((token) => {
    if(prevLineNum != token.lineNum)
    {
        console.log()
        prevLineNum = token.lineNum
    }
    console.log(token.lineNum + "\t" + token.Lexeme + "\t" + token.Type)
    })
}

main2();