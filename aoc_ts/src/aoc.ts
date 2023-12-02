import { PathLike, readFileSync } from "fs";

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

function main(): void {
  // one();
  two();
}

main();
