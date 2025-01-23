import _ from 'lodash';

const renderValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const plain = (diff, pathByKeys = []) => {
  const result = diff.map((item) => {
    const {
      key, state, children, value, oldValue, newValue,
    } = item;
    const propertyName = [...pathByKeys, key].join('.');

    switch (state) {
      case 'added':
        return `Property '${propertyName}' was added with value: ${renderValue(value)}`;
      case 'removed':
        return `Property '${propertyName}' was removed`;
      case 'changed':
        return `Property '${propertyName}' was updated. From ${renderValue(oldValue)} to ${renderValue(newValue)}`;
      case 'nested':
        return `${plain(children, [...pathByKeys, key])}`;
      default:
        return null;
    }
  }).filter(Boolean);

  return result.join('\n');
};

export default plain;
