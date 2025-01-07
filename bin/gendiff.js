#!/usr/bin/env node
import { program } from 'commander';
import parser from '../src/parser.js';
import genDiff from '../src/index.js';

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const parsedPath1 = parser(filepath1);
    const parsedPath2 = parser(filepath2);
    console.log(genDiff(parsedPath1, parsedPath2));
  });
program.parse(process.argv);
