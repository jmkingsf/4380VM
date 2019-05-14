let symT = require("../SymbolTable")

Array.prototype.isArray = true

module.exports = {
    writeComment: function(quad)
    {
        let string = " #" + quad.type
        if(quad.op1)
        {
            string += ` ${quad.op1.value}`
        }

        if(quad.op2)
        {
            string += ` ${quad.op2.value}`
        }

        if(quad.op3)
        {
            string += ` ${getValue(quad.op3)}`
        }

        return string
    },
    loadOp: function(operator, register, locationOverride)
    {
        let symId = operator
        if(operator.symId)
            symId = operator.symId
        if(symId)
        {
            let location;
            if(!locationOverride)
            {
                location = getLocation(symId)
            } else {
                location = locationOverride
            }

            switch(location)
            {
                case locations.stack:
                    let movFPToReg = `MOV ${register} FP` + ` #loading ${symId} from stack`
                    let pointAtFirstValueOnStack = `SUB ${register} #12`
                    let pointAtSymValue = `SUB ${register} #${symT.table[symId].offset}`
                    let loadValue = `LDR ${register} ${register}`
                    return [movFPToReg, pointAtFirstValueOnStack, pointAtSymValue, loadValue]
                case locations.constant:
                    let loadOpDeclaration;
                    if(operator.symId[0] != 'c'){
                        loadOpDeclaration = `LDR ${register} ${operator.symId}`
                    } else {
                        loadOpDeclaration = `LDB ${register} ${operator.symId}`
                    }
                    return [loadOpDeclaration]
                    break;
                case locations.tempOffset:
                    let movFPToReg2 = `MOV ${register} FP` + ` #Loading ${symId} from heap`
                    let pointAtFirstValueOnStack2 = `SUB ${register} #12`
                    let pointAtSymValue2 = `SUB ${register} #${symT.table[symId].offset}`
                    let loadThisPlusOffset = `LDR ${register} ${register}`
                    let loadValueInOffset = `LDR ${register} ${register}`
                    return [movFPToReg2, pointAtFirstValueOnStack2, pointAtSymValue2, loadThisPlusOffset, loadValueInOffset]
                case locations.heap:
                    let loadThis1 = [
                        `MOV R9 FP` + ` #loading ${operator.symId} and this`,
                        `SUB R9 #8`,
                        `LDR ${register} R9`
                    ]
                    let addOffset = `ADD ${register} #${symT.table[symId].offset}`
                    let loadHeapVal = `LDR ${register} ${register}`
                    return this.generateAsm([loadThis1, addOffset, loadHeapVal])
                    //'TRP 99' + 
                case locations.this:
                    let loadThis = [
                        "MOV R9 FP",
                        "SUB R9 #8",
                        `LDR ${register} R9`
                    ]
                    return this.generateAsm([loadThis])
                case locations.bool:
                    let load02 = `LDR ${register} FALSE`
                    if(operator.value == "true")
                        load02 = `LDR ${register} TRUE`
                    return [load02]
                case locations.heapOffset:
                    let loadOffset = `LDR ${register} ${symId}`
                    return [loadOffset]
            }
        }
    },
    storeOp: function(operator, locationOverride)
    {
        if(operator.symId)
        {
            let location;
            if(!locationOverride)
            {
                location = getLocation(operator.symId)
            } else {
                location = locationOverride
            }

            switch(location)
            {
                case locations.stack:
                    let movFPToReg = "MOV R9 FP" + ` #Storing ${operator.symId}`
                    let pointAtFirstValueOnStack = "SUB R9 #12"
                    let pointAtSymValue = `SUB R9 #${symT.table[operator.symId].offset}`
                    let loadValue = `STR R1 R9`
                    return [movFPToReg, pointAtFirstValueOnStack, pointAtSymValue, loadValue]
                    break;
                case locations.constant:
                    let loadOpDeclaration;
                    if(operator.symId[0] != 'c'){
                        loadOpDeclaration = `LDR R2 ${operator.symId}`
                    } else {
                        loadOpDeclaration = `LDB R2 ${operator.symId}`
                    }
                    return [loadOpDeclaration]
                    break;
                case locations.tempOffset:
                    let movFPToReg2 = `MOV R9 FP` + ` #storing ${operator.symId} from heap`
                    let pointAtFirstValueOnStack2 = `SUB R9 #12`
                    let pointAtSymValue2 = `SUB R9 #${symT.table[operator.symId].offset}`
                    let loadThisPlusOffset = `LDR R9 R9`
                    let saveToOffset = `STR R1 R9`
                    return [movFPToReg2, pointAtFirstValueOnStack2, pointAtSymValue2, loadThisPlusOffset, saveToOffset]
                    break;
                case locations.heap:
                    let loadThis = [
                        "MOV R9 FP",
                        "SUB R9 #8",
                        `LDR R9 R9`
                    ]
                    let addOffset = `ADD R9 #${symT.table[operator.symId].offset}`
                    let storeValue = `STR R1 R9`
                    return this.generateAsm([`#storing ${operator.symId}`, loadThis, addOffset, storeValue])
                    //we need to store the value in 9000
                //case locations.arrayOffset:
                    // let movFPToReg3 = `MOV R9 FP` + ` #storing ${operator.symId} from heap`
                    // let pointAtFirstValueOnStack3 = `SUB R9 #12`
                    // let pointAtSymValue3 = `SUB R9 #${symT.table[operator.symId].offset}`
                    // let loadArrOffset = `LDR R9 R9`
                    // let stroreValue = 
            }
        }
    },
    generateAsm: function(arrayOfAsm)
    {
        let asm = []
        arrayOfAsm.forEach(item => {
            if(item.isArray)
            {
                asm = asm.concat(item)
            } else {
                asm.push(item)
            }
        })
        
        return asm
    }
}

function getLocation(symId)
{

    if(symId[0] == "p" || symId[0] == "t" || symId[0] == "l")
    {
        if(symId[0] == "t")
        {
            if(symT.table[symId].data.refVar)
                return locations.tempOffset
            
            if(symT.table[symId].loadFromHeap)
            {
                //module.exports.isAef = false
                return locations.tempOffset
            }
        }

        return locations.stack
    }

    if(symId[0] == "b")
    {
        return locations.bool
    }

    if(symT.table[symId].kind == "ivar")
    {
        return locations.heap
    }

    if(symId[0] == "i")
    {
        return locations.constant
    }

    if(symId[0]== "c")
        return locations.constant

    if(symId[0] == "x")
    {
        return locations.this
    }
}

let locations = {
    stack: "stack",
    heap: "heap",
    localSym: "localSym",
    constant: "constant",
    constructorHeap: "constructorHeap",
    tempOffset: "tempOffset",
    this: "this",
    arrayOffset: "arrayOffset",
    bool: "bool",
    heapOffset: "heapOffset"
}

function getValue(op)
{
    if(op.value)
        return op.value
    
    if(op.symId)
        return op.symId
}