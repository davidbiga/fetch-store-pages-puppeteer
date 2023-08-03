/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
  testEnvironment: 'node',
  preset: 'ts-jest', // or other ESM presets
  // [...]
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(chalk/))',
  ],

}

export default config;