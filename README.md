# postfix-app

Example Node.js app with TypeScript setup

## Prerequisite

- Node 18

## How to use

1. Git clone this repo
2. Run `npm install`
3. Run `npm run start:dev input.csv` or `npm start input.csv`

## Scripts

- `npm build`: build the typescript code to javascript
- `npm run start:dev {path of the file}`: start directly the TypeScript code for development
- `npm start {path of the file}`: compile TypeScript code and run
- `npm run test`: run unit test

## Brief description of the code structure

The recursive approach is used to solve the problem due to the reference of the cell, which can be a value, invalid data, another address, expression with a number, or cell address. Each small process is converted into functions, and asynchronous methods are used where necessary.

I assume that all expression with cell address has vaild solution to number or '#ERR'
