export default {
  testEnvironment: "node",
  testMatch: ["**/__tests__*.test.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "utils*.js",
    "!utils/sendEmail.js",
    "!utils/emailTemplates.js",
  ],
  coverageDirectory: "coverage",
};
