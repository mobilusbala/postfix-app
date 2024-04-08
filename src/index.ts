import { getValue, processAndPrint, readCSV } from "./util.js";

const FILE_PATH = process.argv[2];

const main = async (filePath: string) => {
  if (!filePath) {
    throw Error("Please provide file path");
  }

  const data = await readCSV(filePath);

  //processAndPrint("1  b1    +", data);

  console.log("-------------------------------");

  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);
  }

  // console.log(processAndPrint(2, 2, data));

  // console.log(getValue(2, 2, data));

  let printLine = [];
  for (var i = 0; i < 3; i++) {
    printLine = [];
    for (var z = 0; z < data[i].length; z++) {
      printLine.push(processAndPrint(i, z, data));
    }
    console.log(printLine.join(","));
  }

  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);
  }
};

await main(FILE_PATH);
