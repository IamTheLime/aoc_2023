import { readFileSync } from 'fs';
var OutputStyle;
(function (OutputStyle) {
    OutputStyle[OutputStyle["StringVector"] = 0] = "StringVector";
})(OutputStyle || (OutputStyle = {}));
function read_input(input_location, expected_output) {
    const file_buffer = readFileSync(input_location, { encoding: "utf8", flag: "r" });
    switch (expected_output) {
        case OutputStyle.StringVector:
            return file_buffer.split("\n").filter(x => x !== "");
        default:
            throw "What the fuck is happening here";
    }
    console.log(file_buffer);
}
function main() {
    const readFile = read_input("./inputs/1.example.input", OutputStyle.StringVector);
    console.log(readFile);
}
main();
//# sourceMappingURL=1.js.map