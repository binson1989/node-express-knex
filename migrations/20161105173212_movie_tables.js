exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('rating', (table) => {
            table.increments('id');

            table.string('name', 5).notNullable().unique();
        })
        .createTable('movie', (table) => {
            table.increments('id');

            table.integer('rating_id').notNullable().references('id').inTable('rating');
            table.integer('director_id').notNullable().references('id').inTable('person');

            table.string('title', 200).notNullable().defaultTo('');
            table.string('overview', 999);
            table.integer('releaseyr');
            table.integer('score').notNullable().defaultTo(7);
            table.integer('runtime').notNullable().defaultTo(90);
            table.date('lastplaydate');
        })
        .createTable('tag', (table) => {
            table.increments('id');

            table.string('name', 30).notNullable().unique();
        })
        .createTable('tag_movie', (table) => {
            table.integer('tag_id').notNullable().references('id').inTable('tag').onDelete('CASCADE');
            table.integer('movie_id').notNullable().references('id').inTable('movie').onDelete('CASCADE');

            table.primary(['tag_id', 'movie_id']);
        })
        .createTable('actor_movie', (table) => {
            table.integer('person_id').notNullable().references('id').inTable('person').onDelete('CASCADE');
            table.integer('movie_id').notNullable().references('id').inTable('movie').onDelete('CASCADE');

            table.primary(['person_id', 'movie_id']);
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('actor_movie')
        .dropTableIfExists('tag_movie')
        .dropTableIfExists('tag')
        .dropTableIfExists('movie')
        .dropTableIfExists('rating');
};
