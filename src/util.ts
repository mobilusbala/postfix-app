import * as fs from "fs";

export const readCSV = async (filePath: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const rows: string[][] = data.split("\n").map((row) =>
        row
          .trim()
          .split(",")
          .map((ele) => ele.trim())
      );

      resolve(rows);
    });
  });
};

export const getRowAndColumn = (
  cellRef: string
): { row: number; column: number } | null => {
  const match = cellRef.match(/^([a-z]+)(\d+)$/);
  if (!match) return null;

  const [, columnLetters, rowNumStr] = match;
  const column = columnLetters.toLowerCase().charCodeAt(0) - "a".charCodeAt(0);
  const row = parseInt(rowNumStr, 10) - 1;

  return { row, column };
};

export const processPostfix = (postfixExpression: string): number | null => {
  const stack: number[] = [];

  const operators: { [key: string]: (a: number, b: number) => number } = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "^": (a, b) => Math.pow(a, b),
  };

  const tokens = postfixExpression.split(" ");

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else if (token in operators) {
      const operand2 = stack.pop();
      const operand1 = stack.pop();
      if (operand1 === undefined || operand2 === undefined) {
        return null; // Invalid expression
      }
      const result = operators[token](operand1, operand2);
      stack.push(result);
    } else {
      return null; // Invalid token
    }
  }

  if (stack.length === 1) {
    return stack.pop();
  } else {
    return null; // Invalid expression
  }
};

const isValidOperator = (token: string): boolean => {
  return ["+", "-", "*", "/"].includes(token);
};

const isVaildCell = (token: string): boolean => {
  const regex = /^[a-z]\d+$/i;
  return regex.test(token);
};

const getCellValue = (token: string, data: string[][]): string => {
  try {
    const cell = getRowAndColumn(token);
    const res = data[cell.row][cell.column];
    //console.log(cell.row, cell.column);

    if (token === res) {
      return "#ERR";
    } else {
      return res;
    }
  } catch (error) {
    return "#ERR";
  }
};

const isValidPostfixExpression = (expression: string): boolean => {
  const stack: number[] = [];

  const tokens = expression.split(" ");

  for (const token of tokens) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else if (isValidOperator(token)) {
      if (stack.length < 2) return false; // Invalid expression
      stack.pop(); // Remove one operand
    } else {
      return false; // Invalid token
    }
  }

  return stack.length === 1;
};

// Function to check if a string is a valid postfix expression
const isValidPostfixPattern = (expression: string): boolean => {
  const stack: string[] = [];

  const tokens = expression.split(" ");

  for (const token of tokens) {
    if (!isNaN(parseFloat(token)) || isVaildCell(token)) {
      stack.push(token);
    } else if (isValidOperator(token)) {
      if (stack.length < 2) return false; // Invalid expression
      stack.pop(); // Remove one operand
    } else {
      return false; // Invalid token
    }
  }

  return stack.length === 1;
};

export const getValue = (
  row: number,
  col: number,
  data: string[][]
): string => {
  const cellData = data[row][col];

  //console.log(`---------${cellData}-----`);

  if (!isNaN(Number(cellData))) {
    // console.log("---------Number-----", Number(cellData));
    return cellData;
  } else if (isVaildCell(cellData)) {
    const res = getCellValue(cellData, data);

    if (res !== "#ERR") {
      data[row][col] = res;
    }
    return res;
  } else if (isValidPostfixExpression(cellData)) {
    const res = processPostfix(cellData).toString();
    data[row][col] = res;

    // console.log("---------isValidPostfixExpression-----", res, data[row][col]);

    return res;
  } else if (isValidPostfixPattern(cellData)) {
    const res = cellData.split(" ").map((ele) => {
      if (isVaildCell(ele)) {
        return getCellValue(ele, data);
      }
      return ele;
    });

    data[row][col] = res.join(" ");

    //console.log("---------isValidPostfixPattern-----", data[row][col]);
  } else {
    return "#ERR";
  }
};

export const processAndPrint = (row: number, col: number, data: string[][]) => {
  let result = getValue(row, col, data);

  while (true) {
    if (!isNaN(Number(result)) || result === "#ERR") {
      break;
    } else {
      result = getValue(row, col, data);
    }
  }

  return result;
};
