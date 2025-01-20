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

const stylish = (diff, depthCount = 1, spacesCount = 4) => {
  const result = diff.map((item) => {
    const {
      key, state, children, value, oldValue, newValue,
    } = item;
    const indent = makeIndent(depthCount, spacesCount);

    switch (state) {
      case 'added':
        return `${indent}+ ${key}: ${renderValue(value, depthCount + 1)}`;
      case 'removed':
        return `${indent}- ${key}: ${renderValue(value, depthCount + 1)}`;
      case 'unchanged':
        return `${indent}  ${key}: ${renderValue(value, depthCount + 1)}`;
      case 'changed':
        return [
          `${indent}- ${key}: ${renderValue(oldValue, depthCount + 1)}`,
          `${indent}+ ${key}: ${renderValue(newValue, depthCount + 1)}`,
        ].join('\n');
      case 'nested':
        return `${indent}  ${key}: {\n${stylish(children, depthCount + 1)}\n${makeIndent(depthCount)}  }`;
      default:
        return null;
    }
  });

  return result.join('\n');
};

export default stylish;
