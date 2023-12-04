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
    const readFile = read_input("./inputs/3.input", OutputStyle.StringVector);
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
                        symbol: entry === "." ? "empty" : (entry === "*" ? "gear" : "symbol"),
                        gear_neighbours: []
                    };
                default:
                    return range(min_x, max_x + 1).map((x) => {
                        return {
                            uinique_identifier: `${y_idx}${min_x}${max_x}`,
                            x: x,
                            y: y_idx,
                            symbol: "number",
                            value: parseInt(entry, 10),
                            has_adjacent: false
                        };
                    });
            }
        });
        return parsed_row.flat();
    });
    parsed_file.map((row, y) => {
        row.map((col, x) => {
            if (col.symbol === "symbol" || col.symbol === "gear") {
                // console.log(col)
                range(x - 1, x + 2).map((x) => range(y - 1, y + 2).map((y) => {
                    const entry = parsed_file[y]?.[x];
                    if (entry?.symbol === "number") {
                        entry.has_adjacent = true;
                    }
                }));
            }
            if (col.symbol === "gear") {
                let gear_neighbours = {};
                // console.log(col)
                range(x - 1, x + 2).map((x) => range(y - 1, y + 2).map((y) => {
                    const entry = parsed_file[y]?.[x];
                    if (entry?.symbol === "number") {
                        gear_neighbours[entry.uinique_identifier] = entry.value;
                    }
                }));
                col.gear_neighbours = Object.values(gear_neighbours);
            }
        });
    });
    let found_numbers = {};
    for (let entry of parsed_file.flat()) {
        if (entry.symbol === "number" && entry.has_adjacent === true) {
            found_numbers[entry.uinique_identifier] = entry.value;
        }
    }
    console.log(found_numbers);
    console.log(Object.values(found_numbers).reduce((acc, value) => acc + value));
    const gears_res = parsed_file.flat().filter((val) => val.symbol === "gear" && val.gear_neighbours.length == 2).map((x) => {
        return x.gear_neighbours.reduce((acc, val) => acc * val);
    }).reduce((acc, x) => acc + x);
    console.log(gears_res);
}
function four() {
    const readFile = read_input("./inputs/4.input", OutputStyle.StringVector);
    const res = readFile.map((card) => {
        const card_split_no_prefix = card.split(":");
        const card_split_drawn_hand_game = card_split_no_prefix[1]?.split("|");
        const winning_cards = card_split_drawn_hand_game?.[0]?.split(" ").filter(x => x !== "");
        const lotto_cards = card_split_drawn_hand_game?.[1]?.split(" ").filter(x => x !== "");
        return {
            winning_cards: winning_cards,
            lotto_cards: lotto_cards,
            lotto_in_winning_list: lotto_cards?.filter((lotto_card) => winning_cards?.indexOf(lotto_card) !== -1),
            lotto_in_winning: lotto_cards?.filter((lotto_card) => winning_cards?.indexOf(lotto_card) !== -1).reduce((acc, card) => acc === 0 ? acc + 1 : acc * 2, 0),
            number_of_cards: 1,
        };
    });
    console.log(res.reduce((acc, curr) => acc + curr.lotto_in_winning, 0));
    for (const [index, value] of res.entries()) {
        const total_matching = value.lotto_in_winning_list ? value.lotto_in_winning_list.length : 0;
        for (const card of range(0, value.number_of_cards)) {
            for (const secondary_index of range(index + 1, index + total_matching + 1)) {
                let card = res[secondary_index];
                if (card)
                    card.number_of_cards += 1;
            }
        }
    }
    console.log(res.reduce((acc, curr) => acc + curr.number_of_cards, 0));
}
function main() {
    // one();
    // two();
    // three();
    four();
}
main();
//# sourceMappingURL=aoc.js.map