const defaultConfig = require('../../jest.conf.js');

module.exports = {
  ...defaultConfig,
  resolver: '<rootDir>/resolver.js'
};
