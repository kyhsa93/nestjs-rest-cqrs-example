module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    '.aws',
    '.github',
    'assets',
    '*.md',
    '*.yaml',
    '*.yml',
    'Dockerfile*',
    'node_modules',
    '*ignore',
    '*.json',
  ],
};
