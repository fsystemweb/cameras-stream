module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/out-tsc/'],
    transform: {
      '^.+\\.(ts|js|html)$': [
        'jest-preset-angular',
        {
          tsconfig: '<rootDir>/tsconfig.spec.json',
          stringifyContentPathRegex: '\\.html$',
        },
      ],
    },
    moduleFileExtensions: ['ts', 'html', 'js', 'json'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1'
    }
  };
  
