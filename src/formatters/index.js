import plain from './plain.js';
import stylish from './stylish.js';

export default (diff, formatName) => {
  switch (formatName) {
    case 'plain':
      return plain(diff);
    default:
      return stylish(diff);
  }
};
