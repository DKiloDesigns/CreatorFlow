import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import nextPlugin from 'eslint-config-next';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends('next'),
  {
    ignores: [
      // Generated files
      'src/generated/**/*',
      '.next/**/*',
      'node_modules/**/*',
      'public/**/*'
    ],
    rules: {
      // Add any custom rules here
    }
  }
];