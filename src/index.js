import _ from 'lodash';

const genDiff = (fileData1, fileData2) => {
  const keys = _.union(Object.keys(fileData1), Object.keys(fileData2));
  const sortedKeys = _.sortBy(keys);
  const result = [];
  result.push('{');
  sortedKeys.forEach((key) => {
    if (Object.hasOwn(fileData1, key) && Object.hasOwn(fileData2, key)) {
      if (fileData1[key] === fileData2[key]) {
        result.push(`    ${key}: ${fileData1[key]}`);
      }
    }

    if (Object.hasOwn(fileData1, key) && Object.hasOwn(fileData2, key)) {
      if (fileData1[key] !== fileData2[key]) {
        result.push(`  - ${key}: ${fileData1[key]}`);
        result.push(`  + ${key}: ${fileData2[key]}`);
      }
    }

    if (Object.hasOwn(fileData1, key) && !Object.hasOwn(fileData2, key)) {
      result.push(`  - ${key}: ${fileData1[key]}`);
    }

    if (!Object.hasOwn(fileData1, key) && Object.hasOwn(fileData2, key)) {
      result.push(`  + ${key}: ${fileData2[key]}`);
    }
  });
  result.push('}');
  return result.join('\n');
};

export default genDiff;
