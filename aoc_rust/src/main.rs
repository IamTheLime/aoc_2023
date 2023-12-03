use std::{
    collections::HashMap,
    fs::File,
    io::{self, BufRead, BufReader},
    slice::IterMut,
    vec::Splice,
};

fn file_to_array(input: &str) -> Result<Vec<String>, io::Error> {
    let fd = File::open(input)?;
    let mut buf_reader = BufReader::new(fd);
    let mut lines = vec![];
    for line in buf_reader.lines() {
        lines.push(line?);
    }
    Ok(lines)
}

fn check_if_number() {
    let mut numbers = HashMap::new();
    numbers.insert("one", "1");
    numbers.insert("two", "1");
    numbers.insert("three", "1");
    numbers.insert("four", "1");
    numbers.insert("five", "1");
    numbers.insert("six", "1");
    numbers.insert("seven", "1");
    numbers.insert("eight", "1");
    numbers.insert("nine", "1");
}

fn aoc_1() {
    let mut ex1 = file_to_array("./src/input/1_test.input").unwrap();

    let res = &ex1
        .iter_mut()
        .map(|line| {
            let filtered = line
                .chars()
                .filter(|ch| ch.is_digit(10))
                .collect::<Vec<char>>();

            let mut string_digit = filtered.first().unwrap().to_string();

            string_digit.push(filtered.last().unwrap().to_owned());

            string_digit.parse::<i32>().unwrap()
        })
        .collect::<Vec<i32>>();

    let final_sum: i32 = res.iter().sum();

    println!("{:?}", final_sum);
}

fn main() {
    aoc_1();
}
