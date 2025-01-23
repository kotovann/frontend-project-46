import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { jsonParse, yamlParse } from './parsers.js';
import pickFormat from './formatters/index.js';

const genDiff = (filePath1, filePath2, formatName = 'stylish') => {
  const absolutePath1 = path.resolve(process.cwd(), filePath1);
  const absolutePath2 = path.resolve(process.cwd(), filePath2);

  const file1Data = fs.readFileSync(absolutePath1, 'utf-8');
  const file2Data = fs.readFileSync(absolutePath2, 'utf-8');

  const fileType = path.extname(filePath1).slice(1);

  const file1ParsedData = fileType === 'json' ? jsonParse(file1Data) : yamlParse(file1Data);
  const file2ParsedData = fileType === 'json' ? jsonParse(file2Data) : yamlParse(file2Data);

  const findDifferences = (obj1, obj2) => {
    const keys = _.union(Object.keys(obj1), Object.keys(obj2));
    const sortedKeys = _.sortBy(keys);
    const result = sortedKeys.map((key) => {
      if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
        if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
          return { key, state: 'nested', children: findDifferences(obj1[key], obj2[key]) };
        }

        if (obj1[key] !== obj2[key]) {
          return {
            key, state: 'changed', oldValue: obj1[key], newValue: obj2[key],
          };
        }
      }

      if (Object.hasOwn(obj1, key) && !Object.hasOwn(obj2, key)) {
        return { key, state: 'removed', value: obj1[key] };
      }

      if (!Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
        return { key, state: 'added', value: obj2[key] };
      }
      return { key, state: 'unchanged', value: obj1[key] };
    });
    return result;
  };
  const differences = findDifferences(file1ParsedData, file2ParsedData);
  return pickFormat(differences, formatName);
};

export default genDiff;
