import path from 'path';
import { expect, test } from '@jest/globals';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const jsonFilepath1 = getFixturePath('file1.json');
const jsonFilepath2 = getFixturePath('file2.json');

const yamlFilepath1 = getFixturePath('file1.yaml');
const yamlFilepath2 = getFixturePath('file2.yaml');

const result = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test('gendiff json', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2)).toBe(result);
});

test('gendiff yaml', () => {
  expect(genDiff(yamlFilepath1, yamlFilepath2)).toBe(result);
});
