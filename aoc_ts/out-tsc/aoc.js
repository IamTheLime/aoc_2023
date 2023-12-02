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
function check_if_number(array_slice) {
    if (array_slice[0] === undefined)
        return null;
    const numbers = { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9" };
    const int_conversion_attempt = parseInt(array_slice[0]);
    if (int_conversion_attempt) {
        return array_slice[0];
    }
    for (const entry of Object.keys(numbers)) {
        const potential_number = array_slice.slice(0, entry.length);
        if (entry === potential_number.join("")) {
            return numbers[entry];
        }
    }
    return null;
}
function one() {
    const readFile = read_input("./inputs/1.input", OutputStyle.StringVector);
    let res = readFile.map(line => {
        return line.split('').map((_, index, array) => {
            let res = check_if_number(array.slice(index));
            if (res) {
                return res;
            }
            return undefined;
        }).filter(x => x !== undefined);
    });
    let final_value = res.map(line => parseInt(`${line[0]}${line[line.length - 1]}`)).reduce((x, y) => x + y);
    console.log(final_value);
}
// draw.split(,).map(
//     (colour) => {
//         const colourCount = colour.trim().split(" ");
//         removedRgb[<"red"|"green"|"blue">colourCount[1]] =<number> colourCount[0];
//     } 
// )
function two() {
    const readFile = read_input("./inputs/2.input", OutputStyle.StringVector);
    const bagRgb = {
        red: 12,
        green: 13,
        blue: 14
    };
    const games = readFile.map((game) => {
        const info = game.split(":")[1]?.split(";").map((draw) => {
            let removedRgb = {
                red: 0,
                green: 0,
                blue: 0,
            };
            draw.split(",").map((colour) => {
                const colourCount = colour.trim().split(" ");
                removedRgb[colourCount[1]] = parseInt(colourCount[0]);
            });
            return removedRgb;
        });
        return info;
    });
    let playableGames = [];
    const res_part_1 = games.map((game, index) => {
        return game.reduce((acc, current) => {
            let attempt_current = true;
            for (const rgb of Object.keys(bagRgb)) {
                if (bagRgb[rgb] < current[rgb]) {
                    attempt_current = false;
                    break;
                }
            }
            return acc && attempt_current;
        }, true);
    }).reduce((acc, current, idx) => acc + (current ? idx + 1 : 0), 0);
    console.log("part 1", res_part_1);
    let res_part_2 = games.map((game) => {
        return game.reduce((acc, current) => {
            acc.red = acc.red > current.red ? acc.red : current.red;
            acc.blue = acc.blue > current.blue ? acc.blue : current.blue;
            acc.green = acc.green > current.green ? acc.green : current.green;
            return acc;
        }, { red: 0, green: 0, blue: 0 });
    }).reduce((acc, game) => {
        return acc + Object.values(game).reduce((acc, colourCount) => acc * colourCount, 1);
    }, 0);
    console.log(res_part_2);
}
function main() {
    // one();
    two();
}
main();
//# sourceMappingURL=aoc.js.map