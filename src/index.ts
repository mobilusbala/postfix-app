import { getValue, processAndPrint, readCSV } from "./util.js";

const FILE_PATH = process.argv[2];

(async (filePath: string) => {
  if (!filePath) {
    throw Error("Please provide file path");
  }

  const data = await readCSV(filePath);

  let printLine = [];
  for (var i = 0; i < 3; i++) {
    printLine = [];
    for (var z = 0; z < data[i].length; z++) {
      printLine.push(processAndPrint(i, z, data));
    }
    console.log(printLine.join(","));
  }
})(FILE_PATH);
