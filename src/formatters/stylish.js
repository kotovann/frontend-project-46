import _ from 'lodash';

const makeIndent = (depthCount, spacesCount = 4) => ' '.repeat(depthCount * spacesCount - 2);

const renderValue = (value, depthCount, spacesCount) => {
  if (_.isPlainObject(value)) {
    const entries = Object.entries(value);
    const indent = makeIndent(depthCount, spacesCount);
    const result = entries.map(([key, val]) => `${indent}  ${key}: ${renderValue(val, depthCount + 1, spacesCount)}`);
    return `{\n${result.join('\n')}\n${makeIndent(depthCount - 1, spacesCount)}  }`;
  }
  return value;
};

const stylish = (differences) => {
  const iter = (diff, depthCount = 1, spacesCount = 4) => {
    const result = diff.map((item) => {
      const {
        key, state, children, value, oldValue, newValue,
      } = item;
      const indent = makeIndent(depthCount, spacesCount);

      switch (state) {
        case 'added':
          return `${indent}+ ${key}: ${renderValue(value, depthCount + 1, spacesCount)}`;
        case 'removed':
          return `${indent}- ${key}: ${renderValue(value, depthCount + 1, spacesCount)}`;
        case 'nested':
          return `${indent}  ${key}: {\n${iter(children, depthCount + 1, spacesCount)}\n${makeIndent(depthCount, spacesCount)}  }`;
        case 'changed':
          return [
            `${indent}- ${key}: ${renderValue(oldValue, depthCount + 1, spacesCount)}`,
            `${indent}+ ${key}: ${renderValue(newValue, depthCount + 1, spacesCount)}`,
          ].join('\n');
        default:
          return `${indent}  ${key}: ${renderValue(value, depthCount + 1, spacesCount)}`;
      }
    });
    return result.join('\n');
  };

  const result = iter(differences);
  return `{\n${result}\n}`;
};

export default stylish;
