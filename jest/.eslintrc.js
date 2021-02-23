module.exports = {
  extends: 'guo/mocha',
  plugins: ["jest"],
  env: {
    "jest/globals": true
  },
  rules: {
    "space-before-function-paren": "off",
  }
};
