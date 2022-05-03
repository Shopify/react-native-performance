const baseConfig = require('../../shared/jest.config.base');

module.exports = {
  ...baseConfig,
  setupFiles: [...(baseConfig.setupFiles || []), '<rootDir>/src/__tests__/setupJest.js'],
  setupFilesAfterEnv: ['jest-extended/all'],
};
