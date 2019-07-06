
const knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE,
    pool: { min: 2, max: 7 },
    migrations: {
      tableName: 'knex_migrations'
    }
});

module.exports = knex;