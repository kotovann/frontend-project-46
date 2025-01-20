import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { jsonParse, yamlParse } from './parsers.js';
import stylish from './stylish.js';

const genDiff = (filePath1, filePath2, format = 'stylish') => {
  const absolutePath1 = path.resolve(process.cwd(), filePath1);
  const absolutePath2 = path.resolve(process.cwd(), filePath2);

  const file1Data = fs.readFileSync(absolutePath1, 'utf-8');
  const file2Data = fs.readFileSync(absolutePath2, 'utf-8');

  const fileType = path.extname(filePath1).slice(1);

  let file1ParsedData = '';
  let file2ParsedData = '';

  if (fileType === 'json') {
    file1ParsedData = jsonParse(file1Data);
    file2ParsedData = jsonParse(file2Data);
  } else {
    file1ParsedData = yamlParse(file1Data);
    file2ParsedData = yamlParse(file2Data);
  }

  const findDifferences = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2));
    const sortedKeys = _.sortBy(keys);
    const result = [];
    sortedKeys.forEach((key) => {
      if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
        if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
          result.push({ key, state: 'nested', children: findDifferences(obj1[key], obj2[key]) });
          return;
        }
        if (obj1[key] === obj2[key]) {
          result.push({ key, state: 'unchanged', value: obj1[key] });
        }
        if (obj1[key] !== obj2[key]) {
          result.push({
            key, state: 'changed', oldValue: obj1[key], newValue: obj2[key],
          });
        }
      }

      if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
        result.push({ key, state: 'removed', value: obj1[key] });
      }

      if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
        result.push({ key, state: 'added', value: obj2[key] });
      }
    });
    return result;
  };
  const differences = findDifferences(file1ParsedData, file2ParsedData);
  if (format === 'stylish') {
    return `{\n${stylish(differences)}\n}`;
  }
  return null;
};

export default genDiff;
