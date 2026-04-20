module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testRegex: "tests/.*\\.test\\.js$",
  testPathIgnorePatterns: ["/node_modules/", "/src/"],
  roots: ["<rootDir>"],
  modulePaths: ["<rootDir>"],
  collectCoverageFrom: [
    "src/controllers/**/*.js",
    "src/services/**/*.js",
    "src/middlewares/**/*.js",
    "src/utils/**/*.js",
    "!src/**/index.js",
    "!src/server.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html", "clover"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/models/",
    "/src/migrations/",
    "/src/views/",
    "/src/config/",
    "/src/route/",
  ],
};
