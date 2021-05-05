module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'operator-linebreak': ['error', 'after'],
    'no-confusing-arrow': 0,
    'implicit-arrow-linebreak': 0,
    'function-paren-newline': 0,
  },
};
