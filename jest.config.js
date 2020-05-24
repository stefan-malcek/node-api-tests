const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
    'verbose': true,
    'roots': [
        '<rootDir>/src',
        '<rootDir>/tests',
    ],
    'collectCoverageFrom': [
        'src/**/*.ts'
    ],
    'transform': {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper
};
