const rules = {
  '@typescript-eslint/no-unused-vars': [
    'error', 
    { 
      argsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  'no-constant-condition': 'off',
  'no-redeclare': 'off',
  'no-var': 'off',
  'prefer-const': 'off',
  'quotes': [
    'error',
    'single',
    { 
      allowTemplateLiterals: true,
    },
  ],
  'indent': [
    'error',
    2,
  ],
  'semi': [
    'error',
    'always',
  ],
  'no-else-return': 'error',
  'comma-dangle': [
    'error',
    'always-multiline',
  ],
  'space-before-function-paren': [
    'error',
    'always',
  ],
  'padding-line-between-statements': [
    'error',
    { 
      blankLine: 'always', 
      prev: '*',
      next: 'return',
    },
  ],
};
  
module.exports = {
  root: true,
  ignorePatterns: ['**/dist/**'],
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: { 
    es6: true,
    node: true,
  },
  rules,
};