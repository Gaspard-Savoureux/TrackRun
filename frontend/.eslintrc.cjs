/* eslint quote-props: 0 */
/** @type { import('eslint').Linter.Config } */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  rules: {
    'indent': [2, 2],
    'eol-last': [2, 'always'],
    'key-spacing': [2],
    'semi': [2, 'always'],
    'space-infix-ops': [2],
    'keyword-spacing': [2, { 'before': true, 'after': true }],
    'space-before-blocks': [2, 'always'],
    'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
    'no-cond-assign': 2,
    'no-unused-vars': 2,
    'object-shorthand': [2, 'always'],
    'no-const-assign': 2,
    'no-console': 1,
    'no-class-assign': 2,
    'no-this-before-super': 2,
    'no-var': 2,
    'no-unreachable': 2,
    'valid-typeof': 2,
    'quote-props': [2, 'as-needed'],
    'quotes': ['error', 'single'],
    'one-var': [2, 'never'],
    'prefer-arrow-callback': 2,
    'prefer-const': [2, { 'destructuring': 'all' }],
    'arrow-spacing': 2,
    'no-inner-declarations': 0,
  },
};
