exports.up = function(knex) {
  return knex.schema.createTable("users", userTable => {
    userTable
      .string("username")
      .unique()
      .primary()
      .notNullable();
    userTable.string("avatar_url").notNullable();
    userTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
