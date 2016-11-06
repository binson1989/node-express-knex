exports.up = function (knex, Promise) {
    return knex.schema.createTable('person', (personTable) => {
        personTable.increments('id');
        personTable.string('firstname', 30).notNullable().defaultTo('n/a');
        personTable.string('lastname', 30).notNullable().defaultTo('n/a');
        personTable.string('junk', 60).notNullable().defaultTo('n/a');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTableIfExists('person');
};
