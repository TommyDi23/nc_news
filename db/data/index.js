const ENV = process.env.NODE_ENV || "development";
const testData = require("./test-data");
const devData = require("./development-data");
const development = require('../../knexfile')

const data = {
  production: development,
  development: devData,
  test: testData
};

module.exports = data[ENV];
