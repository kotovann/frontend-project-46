import fs from 'fs';
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

const result = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');

test('gendiff json', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2)).toBe(result);
});

test('gendiff yaml', () => {
  expect(genDiff(yamlFilepath1, yamlFilepath2)).toBe(result);
});

const resultPlain = fs.readFileSync(getFixturePath('resultPlain.txt'), 'utf-8');

test('gendiff json plain', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'plain')).toBe(resultPlain);
});

test('gendiff yaml plain', () => {
  expect(genDiff(yamlFilepath1, yamlFilepath2, 'plain')).toBe(resultPlain);
});

const resultJson = fs.readFileSync(getFixturePath('resultJson.json'), 'utf-8');

test('gendiff json jsonFormat', () => {
  expect(genDiff(jsonFilepath1, jsonFilepath2, 'json')).toBe(resultJson);
});

test('gendiff yaml jsonFormat', () => {
  expect(genDiff(yamlFilepath1, yamlFilepath2, 'json')).toBe(resultJson);
});
