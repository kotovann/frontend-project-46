import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parser.js';

const genDiff = (filePath1, filePath2) => {
  const absolutePath1 = path.resolve(process.cwd(), filePath1);
  const absolutePath2 = path.resolve(process.cwd(), filePath2);

  const readedFile1 = fs.readFileSync(absolutePath1, 'utf-8');
  const readedFile2 = fs.readFileSync(absolutePath2, 'utf-8');

  const file1ParsedData = parse(readedFile1);
  const file2ParsedData = parse(readedFile2);

  const keys = _.union(Object.keys(file1ParsedData), Object.keys(file2ParsedData));
  const sortedKeys = _.sortBy(keys);
  const result = [];
  result.push('{');
  sortedKeys.forEach((key) => {
    if (Object.hasOwn(file1ParsedData, key) && Object.hasOwn(file2ParsedData, key)) {
      if (file1ParsedData[key] === file2ParsedData[key]) {
        result.push(`    ${key}: ${file1ParsedData[key]}`);
      }
    }

    if (Object.hasOwn(file1ParsedData, key) && Object.hasOwn(file2ParsedData, key)) {
      if (file1ParsedData[key] !== file2ParsedData[key]) {
        result.push(`  - ${key}: ${file1ParsedData[key]}`);
        result.push(`  + ${key}: ${file2ParsedData[key]}`);
      }
    }

    if (Object.hasOwn(file1ParsedData, key) && !Object.hasOwn(file2ParsedData, key)) {
      result.push(`  - ${key}: ${file1ParsedData[key]}`);
    }

    if (!Object.hasOwn(file1ParsedData, key) && Object.hasOwn(file2ParsedData, key)) {
      result.push(`  + ${key}: ${file2ParsedData[key]}`);
    }
  });
  result.push('}');
  return result.join('\n');
};

export default genDiff;
