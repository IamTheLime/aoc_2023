import { PathLike, readFileSync } from "fs";
import { parse } from "url";

type StringVectorOutput = String[];

enum OutputStyle {
  StringVector,
}

function read_input(
  input_location: PathLike,
  expected_output: OutputStyle,
): StringVectorOutput {
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

type Optional<T> = null | T;

function check_if_number(array_slice: string[]): Optional<string> {
  if (array_slice[0] === undefined) return null;
  const numbers: Record<string, string> = {
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
      return <string>numbers[entry];
    }
  }

  return null;
}

function one(): void {
  const readFile = read_input("./inputs/1.input", OutputStyle.StringVector);

  let res = readFile.map((line) => {
    return line
      .split("")
      .map((_: string, index: number, array: string[]) => {
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
////////////////////////////////////////////////////////////////////////////////

type RGB = Record<"red" | "green" | "blue", number>;

function two(): void {
  const readFile = read_input("./inputs/2.input", OutputStyle.StringVector);

  const bagRgb: RGB = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const games = readFile.map((game) => {
    const info = <RGB[]>game
      .split(":")[1]
      ?.split(";")
      .map((draw) => {
        let removedRgb: RGB = {
          red: 0,
          green: 0,
          blue: 0,
        };
        draw.split(",").map((colour) => {
          const colourCount = colour.trim().split(" ");
          removedRgb[<"red" | "green" | "blue">colourCount[1]] = <number>(
            parseInt(<string>colourCount[0])
          );
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
          if (
            bagRgb[<"red" | "green" | "blue">rgb] <
            current[<"red" | "green" | "blue">rgb]
          ) {
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
      return game.reduce(
        (acc, current) => {
          acc.red = acc.red > current.red ? acc.red : current.red;
          acc.blue = acc.blue > current.blue ? acc.blue : current.blue;
          acc.green = acc.green > current.green ? acc.green : current.green;
          return acc;
        },
        { red: 0, green: 0, blue: 0 },
      );
    })
    .reduce((acc, game) => {
      return (
        acc +
        Object.values(game).reduce((acc, colourCount) => acc * colourCount, 1)
      );
    }, 0);
  console.log(res_part_2);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CoordinatesInfoSymbol = {
    x: number 
    y: number 
    symbol: "empty" | "symbol"
}

type CoordinatesInfoNumber = {
    x: number
    y: number 
    hash: string 
    symbol: number
    reference: string
    include_in_range?: boolean
}

type CoordinatesInfo = CoordinatesInfoNumber | CoordinatesInfoSymbol

function range(start:number, end:number, step:number = 1): number[] {
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

function three(): void {
  const readFile = read_input("./inputs/3.example.input", OutputStyle.StringVector);
    const parsed_file = readFile.map((row, y_idx) => {
        let new_row = row.split(/((?=[^\d])|(?<=[^\d]))/).filter(x => x !== "");
        let track_x_shift = 0;
        let parsed_row = new_row.map( (entry, index)  => {
            let min_x = index + track_x_shift;
            let max_x = (entry.length > 1) ? min_x + entry.length - 1 : min_x;
            track_x_shift += (entry.length > 1) ? entry.length-1 : 0
            switch (entry) {
                case entry.match(/[^\d]/)?.input:
                    return <CoordinatesInfoSymbol>{
                        x: min_x,
                        y: y_idx,
                        symbol: entry === "." ? "empty" : "symbol" 
                    }
                default:
                    return range(min_x,max_x+1).map( (x) => {
                        return <CoordinatesInfoNumber>{
                            hash: `${y_idx}${min_x}${max_x}`,
                            x:x,
                            y: y_idx,
                            symbol: parseInt(entry, 10),
                            reference: entry.at(x)
                        }
                    })
            }
        }) 
        return parsed_row.flat();
    });
    
    let select_numbers = new Set();
    parsed_file.map((row, y) => {
        row.map((col, x) => {
            if (col.symbol === "symbol"){
               range(x-1,x+2).map((x) => range(y-1, y+2).map((y)=>{
                    switch (parsed_file[x][y]) {
                        case 
                    }
                })) 
            } 
        })
    })

    console.log(parsed_file);
    
}

function main(): void {
  // one();
  // two();
    three();
}

main();
