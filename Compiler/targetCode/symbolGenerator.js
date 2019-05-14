let symbolTable = require("../SymbolTable.js")
let constantInts = []
let constantChars = []
let localVariables = []
let tempVariables = []
let heapOffsets = []

module.exports = {
    processSymbolTable: function () {
        writeTrueAndFalseSymbol()

        symbolTable.keys.forEach(key => {
            let symbol = symbolTable.table[key]
            let symbolType = determineSymbolType(symbol)
            writeSymbol(symbolType, symbol)
        })
    },
    printSymbolsToConsole: function() {
        console.log("//constant ints")
        constantInts.forEach(symbol => {
            console.log(symbol)
        })

        console.log("//constant chars")
        constantChars.forEach(symbol => {
            console.log(symbol)
        })

        console.log("\n//local variables")
        localVariables.forEach(symbol => {
            console.log(symbol)
        })

        console.log("\n//temp variables")
        tempVariables.forEach(symbol => {
            console.log(symbol)
        })
    },
    writeToFile: function(fileName) {
        fs.appendFileSync(fileName, "#constant ints" + "\n");
        constantInts.forEach(symbol => {
            fs.appendFileSync(fileName, symbol + "\n");
        })

        fs.appendFileSync(fileName, "#constant chars" + "\n");
        constantChars.forEach(symbol => {
            fs.appendFileSync(fileName, symbol + "\n");
        })

        fs.appendFileSync(fileName, "\n#heap offsets" + "\n");
        heapOffsets.forEach(symbol => {
            fs.appendFileSync(fileName, symbol + "\n");
        })

        fs.appendFileSync(fileName, "\n#temp variables" + "\n");
        tempVariables.forEach(symbol => {
            fs.appendFileSync(fileName, symbol + "\n");
        })
    }
}

function determineSymbolType(symbol)
{
    if(symbolTypes[symbol.kind])
    {
        return symbolTypes[symbol.kind]
    }
}

let symbolTypes = {
    lvar: "localVariable",
    int: "intDeclaration",
    temp: "tempVariable",
    char: "charDeclaration",
    method: "methodDeclaration",
    ivar: "heapOffset"
}

function writeSymbol(symbolType, symbol)
{
    switch(symbolType)
    {
        case symbolTypes.int:
            writeIntDeclaration(symbol)
            break;
        case symbolTypes.char:
            writeCharDeclaration(symbol)
            break;
        case symbolTypes.temp:
            writeTempDeclaration(symbol)
            break;
        case symbolTypes.lvar:
            writeLocalVariable(symbol)
            break;
        case symbolTypes.method:
            writeMethodSymbol(symbol)
            break;
        case symbolTypes.ivar:
            writeHeapOffset(symbol)
            break;
    }
}

function writeIntDeclaration(symbol)
{
    let declaration = `${symbol.key} .INT ${symbol.value}`
    constantInts.push(declaration)
}

function writeCharDeclaration(symbol)
{
    let declaration = `${symbol.key} .BYT ${symbol.value}`
    constantChars.push(declaration)
}

function writeTempDeclaration(symbol)
{
    let type = ".BYT"
    if(symbol.data.type == "int" ||symbol.data.type == "bool" || symbol.data["constructor"])
        type = ".INT"

    let declaration = `${symbol.key} ${type} 0 #${symbol.value}`
    tempVariables.push(declaration)
}

function writeLocalVariable(symbol)
{
    // let type = ".BYT"
    // if(symbol.data.type == "int")
    //     type = ".INT"

    // if(symbol.data.type == "cat")
    //     return

    // let declaration = `${symbol.key} ${type} ${symbol.value}`
    // localVariables.push(declaration)
}

function writeMethodSymbol(symbol)
{

}

function writeHeapOffset(symbol)
{
    let declaration = `${symbol.key} .INT ${symbol.offset}`
    heapOffsets.push(declaration)
}

function writeTrueAndFalseSymbol()
{
    let falseDeclaration = "TRUE .INT 1"
    let trueDeclaration = "FALSE .INT 0"

    constantInts.push(falseDeclaration)
    constantInts.push(trueDeclaration)
}