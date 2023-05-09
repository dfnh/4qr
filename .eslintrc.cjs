// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
      files: ['*.ts', '*.tsx'],
      parserOptions: { project: path.join(__dirname, 'tsconfig.json') },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: path.join(__dirname, 'tsconfig.json') },
  plugins: ['@typescript-eslint'], //'react-hook-form'
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:react-hook-form/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    // 'no-console': ['warn', { allow: ['error'] }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    /** for react-hook-form */
    '@typescript-eslint/no-misused-promises': [
      2,
      { checksVoidReturn: { attributes: false } },
    ],
  },
};

module.exports = config;
