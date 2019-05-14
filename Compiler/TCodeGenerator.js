let quadProxy = require("./iCode/quadArrayProxy")
let symbolTable = require("./targetCode/symbolGenerator.js")

let tCodeAlgorithms = require("./targetCode/targetCodeAlgorithms") 
let mainAsm = []


module.exports = {
    start: function()
    {
        removeCommentsFromSQuad()
        symbolTable.processSymbolTable()
        processMain()
        processFunctions()
    },
    printToConsole: function()
    {
        symbolTable.printSymbolsToConsole()

        console.log("\n\n//Starting main")
        mainAsm.forEach(line => {
            console.log(line)
        })
    },
    writeToFile: function()
    {
        let programName = "program.asm"
        const fs = require('fs');

        fs.unlinkSync(programName);

        addOverflowSymbols(programName)
        addUnderflowSymbols(programName)
        symbolTable.writeToFile(programName)

        mainAsm.forEach(line => {
            fs.appendFileSync(programName, line + "\n");
        })

        addOverflowInstructions(programName)
        addUnderflowInstructions(programName)
    }
}

function processMain()
{
    let foundMain = false
    let i = 0
    for(i; i < quadProxy.quadArray.value.length -1; i++)
    {
        let quad = quadProxy.quadArray.value[i]
        if(quad.type == "MAIN")
        {
            foundMain = true;
        }
        
        if(tCodeAlgorithms[quad.type] && foundMain)
        {
            let targetCode
                targetCode = tCodeAlgorithms[quad.type](quad)
            
            prependLabel(quad, targetCode)
            mainAsm = mainAsm.concat(targetCode)
        }
    }
    // quadProxy.quadArray.value.forEach(quad => {
        
    // })

    mainAsm.push("TRP 0")
}

function processFunctions()
{
    let foundMain = false;
    mainAsm.push("\n#Functions")
    let i = 0
    for(i; i < quadProxy.quadArray.value.length -1; i++)
    {
        let quad = quadProxy.quadArray.value[i]
        if(quad.type == "MAIN")
        {
            foundMain = true
            return
        }
        
        if(tCodeAlgorithms[quad.type] && !foundMain)
        {
            if(quad.type == "FUNC")
            {
                if(quad.op1[0] == "x")
                {
                    addStaticInitialization(quad)
                }
                //run static initialization
            }
            let targetCode
            try{
                targetCode = tCodeAlgorithms[quad.type](quad)
            }catch(err)
            {
                console.log(quad)
            }
            
            prependLabel(quad, targetCode)
            mainAsm = mainAsm.concat(targetCode)
        }
    }
    // quadProxy.quadArray.value.forEach(quad => {

    // })
}

function prependLabel(quad, targetCode)
{
    if(quad.label)
    {
        targetCode[0] = quad.label + ` ${targetCode[0]}`
    }
}

let overflowAndUnderflow = require("./targetCode/overflowAndUnderflow")

function addOverflowSymbols(programName)
{
    overflowAndUnderflow.overflowSymbols.forEach(line => {
        fs.appendFileSync(programName, line + "\n");
    })
}

function addOverflowInstructions(programName)
{
    overflowAndUnderflow.overflowInstructions.forEach(line => {
        fs.appendFileSync(programName, line + "\n");
    })
}

function addUnderflowSymbols(programName)
{
    overflowAndUnderflow.underflowSymbols.forEach(line => {
        fs.appendFileSync(programName, line + "\n");
    })
}

function addUnderflowInstructions(programName)
{
    overflowAndUnderflow.underflowInstructions.forEach(line => {
        fs.appendFileSync(programName, line + "\n");
    })
}

function removeCommentsFromSQuad()
{
    // let i = 0
    // for(i; i<quadProxy.sQuadArray.value.length; i++)
    // {
    //     let quad = quadProxy.sQuadArray.value[i]
    //     if(quad.type == "COMMENT")
    //     {
    //         quadProxy.sQuadArray.value.splice(i, 1)
    //         i -= 1
    //     }
    // }
}

function addStaticInitialization(quad)
{
    mainAsm.push("#Static initialize")
    addFuncLabel(quad)
    quadProxy.sQuadArray.value[quad.label].forEach(quad => {
        if(tCodeAlgorithms[quad.type])
        {
            let targetCode
                targetCode = tCodeAlgorithms[quad.type](quad)
            prependLabel(quad, targetCode)
            mainAsm = mainAsm.concat(targetCode)
        }
    })
}

function addFuncLabel(quad)
{
    if(quadProxy.sQuadArray.value[quad.label][0])
        quadProxy.sQuadArray.value[quad.label][0].label = quad.op1

}