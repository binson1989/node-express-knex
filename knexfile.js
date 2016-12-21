module.exports = {
    //'development' & 'production' names are imp for knex, since it default to 'development' or process.env.NODE_ENV
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5433,
            database: 'knex-movie',
            user: 'postgres',
            password: 'postgres'
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds'
        },
        debug: false
    },
    production: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            database: 'knex-movie',
            user: 'postgres',
            password: 'postgres'
        },
        migrations: {
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './seeds'
        },
        debug: false
    }
};