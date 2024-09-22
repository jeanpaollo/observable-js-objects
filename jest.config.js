module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  coveragePathIgnorePatterns: ["/dist/"],
};
