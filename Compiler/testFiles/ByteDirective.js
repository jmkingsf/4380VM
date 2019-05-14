module.exports = class ByteDirective 
{
    constructor(line, label)
    {
        var values = line.split(" ");

        this.label = label;
        this.size = 1;
        var offset = label ? 1 : 0;

        this.type = values[0+offset];
        this.value = values[1 + offset];
        if(this.value == "'")
        {
            this.value = 32
        }

        if(this.value[1] == '\\')
        {
            this.value = 10;
        }
    }
}