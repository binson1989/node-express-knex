
exports.up = function (knex, Promise) {
    return knex.schema.hasTable('person')
        .then((exists) => {
            if (exists) {
                return knex.schema.table('person', (personTable) => {
                    personTable.specificType('path', 'ltree');
                });
            }
        });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('person', (personTable) => {
        personTable.dropColumn('path');
    });
};
