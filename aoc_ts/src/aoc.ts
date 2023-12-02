import {PathLike, readFileSync} from 'fs';

type StringVectorOutput= String[];


enum OutputStyle {
    StringVector
}

type Trie = Record<number, number | null> | Record<string,  string | null>;



function read_input(input_location: PathLike, expected_output: OutputStyle): StringVectorOutput { 
    
    const file_buffer = readFileSync(input_location, {encoding: "utf8", flag: "r"});

    switch (expected_output) {
        case OutputStyle.StringVector:
            return file_buffer.split("\n").filter(x => x !== "");
        default:
            throw "What the fuck is happening here"
    }

    console.log(file_buffer);

}

type Optional<T> = null | T

function check_if_number (array_slice: string[]): Optional<string> {
    if (array_slice[0] === undefined) return null;
    const numbers: Record<string, string> = { one:"1", two:"2", three:"3", four:"4", five:"5", six:"6", seven:"7", eight:"8", nine:"9" }
    const int_conversion_attempt = parseInt(array_slice[0]);
    if ( int_conversion_attempt ){
        return array_slice[0];
    }
    for(const entry of Object.keys(numbers)) {
        const potential_number =array_slice.slice(0, entry.length);

        if (entry === potential_number.join("")){
           return <string>numbers[entry];
        }
    }
    
    return null;
}

function main(): void{
    const readFile = read_input("./inputs/1.input", OutputStyle.StringVector);

    let res = readFile.map(line => {
        return line.split('').map((_: string, index:number, array:string[]) => {
           let res = check_if_number(array.slice(index));
            if (res) {
                return res;
            }
            return undefined;
        }).filter(x=> x!==undefined);
    })
   
    let final_value = res.map(line => parseInt(`${line[0]}${line[line.length-1]}`)).reduce((x, y) => x+y);

    console.log(final_value);
}

main();
