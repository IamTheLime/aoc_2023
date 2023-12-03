import { readFileSync } from "fs";
var OutputStyle;
(function (OutputStyle) {
    OutputStyle[OutputStyle["StringVector"] = 0] = "StringVector";
})(OutputStyle || (OutputStyle = {}));
function read_input(input_location, expected_output) {
    const file_buffer = readFileSync(input_location, {
        encoding: "utf8",
        flag: "r",
    });
    switch (expected_output) {
        case OutputStyle.StringVector:
            return file_buffer.split("\n").filter((x) => x !== "");
        default:
            throw "What the fuck is happening here";
    }
}
function check_if_number(array_slice) {
    if (array_slice[0] === undefined)
        return null;
    const numbers = {
        one: "1",
        two: "2",
        three: "3",
        four: "4",
        five: "5",
        six: "6",
        seven: "7",
        eight: "8",
        nine: "9",
    };
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
    let res = readFile.map((line) => {
        return line
            .split("")
            .map((_, index, array) => {
            let res = check_if_number(array.slice(index));
            if (res) {
                return res;
            }
            return undefined;
        })
            .filter((x) => x !== undefined);
    });
    let final_value = res
        .map((line) => parseInt(`${line[0]}${line[line.length - 1]}`))
        .reduce((x, y) => x + y);
    console.log(final_value);
}
function two() {
    const readFile = read_input("./inputs/2.input", OutputStyle.StringVector);
    const bagRgb = {
        red: 12,
        green: 13,
        blue: 14,
    };
    const games = readFile.map((game) => {
        const info = game
            .split(":")[1]
            ?.split(";")
            .map((draw) => {
            let removedRgb = {
                red: 0,
                green: 0,
                blue: 0,
            };
            draw.split(",").map((colour) => {
                const colourCount = colour.trim().split(" ");
                removedRgb[colourCount[1]] = (parseInt(colourCount[0]));
            });
            return removedRgb;
        });
        return info;
    });
    let playableGames = [];
    const res_part_1 = games
        .map((game, index) => {
        return game.reduce((acc, current) => {
            let attempt_current = true;
            for (const rgb of Object.keys(bagRgb)) {
                if (bagRgb[rgb] <
                    current[rgb]) {
                    attempt_current = false;
                    break;
                }
            }
            return acc && attempt_current;
        }, true);
    })
        .reduce((acc, current, idx) => acc + (current ? idx + 1 : 0), 0);
    console.log("part 1", res_part_1);
    let res_part_2 = games
        .map((game) => {
        return game.reduce((acc, current) => {
            acc.red = acc.red > current.red ? acc.red : current.red;
            acc.blue = acc.blue > current.blue ? acc.blue : current.blue;
            acc.green = acc.green > current.green ? acc.green : current.green;
            return acc;
        }, { red: 0, green: 0, blue: 0 });
    })
        .reduce((acc, game) => {
        return (acc +
            Object.values(game).reduce((acc, colourCount) => acc * colourCount, 1));
    }, 0);
    console.log(res_part_2);
}
function range(start, end, step = 1) {
    let output = [];
    if (typeof end === 'undefined') {
        end = start;
        start = 0;
    }
    for (let i = start; i < end; i += step) {
        output.push(i);
    }
    return output;
}
function three() {
    const readFile = read_input("./inputs/3.example.input", OutputStyle.StringVector);
    const parsed_file = readFile.map((row, y_idx) => {
        let new_row = row.split(/((?=[^\d])|(?<=[^\d]))/).filter(x => x !== "");
        let track_x_shift = 0;
        let parsed_row = new_row.map((entry, index) => {
            let min_x = index + track_x_shift;
            let max_x = (entry.length > 1) ? min_x + entry.length - 1 : min_x;
            track_x_shift += (entry.length > 1) ? entry.length - 1 : 0;
            switch (entry) {
                case entry.match(/[^\d]/)?.input:
                    return {
                        x: min_x,
                        y: y_idx,
                        symbol: entry === "." ? "empty" : "symbol"
                    };
                default:
                    return range(min_x, max_x + 1).map((x) => {
                        return {
                            hash: `${y_idx}${min_x}${max_x}`,
                            x: x,
                            y: y_idx,
                            symbol: parseInt(entry, 10),
                            reference: entry.at(x)
                        };
                    });
            }
        });
        return parsed_row.flat();
    });
    parsed_file.map((row) => {
        row.map((col) => {
        });
    });
    console.log(parsed_file);
}
function main() {
    // one();
    // two();
    three();
}
main();
//# sourceMappingURL=aoc.js.map