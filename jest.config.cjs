module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', {
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]]
    }],
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

