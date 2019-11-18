const knex = require("knex");
const dbConfig = require("../knexfile");

const connection = knex(...customConfig[ENV], ...baseConfig);

module.exports = connection;
