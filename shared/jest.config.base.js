const path = require('path');

module.exports = {
  verbose: true,
  preset: 'react-native',
  transform: {
    '^.+\\.jsx?$': path.join(__dirname, './jest-transformer.js'),
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  resolver: path.join(__dirname, './resolver.js'),
};
