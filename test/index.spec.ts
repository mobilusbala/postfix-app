import fs from "fs";
import {
  getRowAndColumn,
  processAndPrint,
  processPostfix,
  readCSV,
} from "../src/util.js";

describe("readCSV function", () => {
  const testCSVPath = "test.csv";
  const testData = "1,2,3\n4,5,6\n7,8,9";

  beforeAll(() => {
    fs.writeFileSync(testCSVPath, testData);
  });

  afterAll(() => {
    fs.unlinkSync(testCSVPath);
  });

  test("should read CSV file and return two-dimensional array", async () => {
    const result = await readCSV(testCSVPath);
    const expected = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
    ];
    expect(result).toEqual(expected);
  });

  test("should reject with error for non-existing file", async () => {
    const nonExistingFilePath = "non-existing.csv";
    await expect(readCSV(nonExistingFilePath)).rejects.toThrow();
  });
});

describe("getRowAndColumn function", () => {
  test("should return row and column indices for valid cell references", () => {
    expect(getRowAndColumn("a2")).toEqual({ row: 1, column: 0 });
    expect(getRowAndColumn("b4")).toEqual({ row: 3, column: 1 });
    expect(getRowAndColumn("c10")).toEqual({ row: 9, column: 2 });
  });

  test("should return null for invalid cell references", () => {
    expect(getRowAndColumn("d")).toBeNull(); // Invalid cell reference
    expect(getRowAndColumn("D6")).toBeNull(); // Invalid cell reference
    expect(getRowAndColumn("E5A")).toBeNull(); // Invalid cell reference
    expect(getRowAndColumn("")).toBeNull(); // Invalid cell reference
  });
});

describe("processPostfix function", () => {
  test("should evaluate valid postfix expressions correctly", () => {
    expect(processPostfix("3 4 +")).toBe(7);
    expect(processPostfix("5 2 *")).toBe(10);
    expect(processPostfix("10 3 /")).toBeCloseTo(3.333, 3); // Approximate equality due to floating point precision
    expect(processPostfix("2 3 ^")).toBe(8);
    expect(processPostfix("4 2 + 5 *")).toBe(30);
    expect(processPostfix("7 3 2 * +")).toBe(13);
    expect(processPostfix("5 4 3 2 * + -")).toBe(-5);
  });

  test("should return null for invalid postfix expressions", () => {
    expect(processPostfix("3 4 + *")).toBeNull(); // Missing operand
    expect(processPostfix("3 4")).toBeNull(); // Incomplete expression
    expect(processPostfix("A B +")).toBeNull(); // Invalid token
    expect(processPostfix("10 0 /")).toBe(Infinity); // Division by zero
  });
});

describe("processAndPrint function", () => {
  const data = [
    ["10", "1 3 +", "2 3 -"],
    ["b1 b2 *", "a1", "b1 a2 / c1 +"],
    ["+", "1 2 3", "c3"],
  ];

  test("should evaluate valid postfix expressions correctly", () => {
    expect(processAndPrint(0, 0, data)).toBe("10");
    expect(processAndPrint(0, 1, data)).toBe("4");
    expect(processAndPrint(0, 2, data)).toBe("-1");
    expect(processAndPrint(1, 0, data)).toBe("40");
    expect(processAndPrint(1, 1, data)).toBe("10");
    expect(processAndPrint(1, 2, data)).toBe("-0.9");
    expect(processAndPrint(2, 0, data)).toBe("#ERR");
    expect(processAndPrint(2, 1, data)).toBe("#ERR");
    expect(processAndPrint(2, 2, data)).toBe("#ERR");
  });
});
