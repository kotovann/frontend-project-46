import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { jsonParse, yamlParse } from './parsers.js';

const genDiff = (filePath1, filePath2) => {
  const absolutePath1 = path.resolve(process.cwd(), filePath1);
  const absolutePath2 = path.resolve(process.cwd(), filePath2);

  const File1Data = fs.readFileSync(absolutePath1, 'utf-8');
  const File2Data = fs.readFileSync(absolutePath2, 'utf-8');

  const fileType = path.extname(filePath1).slice(1);

  let file1ParsedData ;
  let file2ParsedData ;

  if (fileType === 'json') {
    file1ParsedData = jsonParse(File1Data);
    file2ParsedData = jsonParse(File2Data);
  } else {
    file1ParsedData = yamlParse(File1Data);
    file2ParsedData = yamlParse(File2Data);
  }

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
