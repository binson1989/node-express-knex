
exports.up = function (knex, Promise) {
    return knex.schema.hasTable('person')
        .then((exists) => {
            if (exists) {
                return knex.schema.table('person', (personTable) => {
                    personTable.renameColumn('junk', 'name');
                });
            }
        });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('person', (personTable) => {
        personTable.renameColumn('name', 'junk');
    });
};
