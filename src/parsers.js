import yaml from 'js-yaml';

const yamlParse = (data) => yaml.load(data);

const jsonParse = (data) => JSON.parse(data);

export { yamlParse, jsonParse };
