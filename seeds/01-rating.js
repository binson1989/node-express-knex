exports.seed = function (knex, Promise) {
  let tableName = 'rating';
  let rows = [
    { name: 'G' },
    { name: 'PG' },
    { name: 'PG-13' },
    { name: 'R' }
  ];

  return knex(tableName).del()
    .then(() => {
      return knex.insert(rows).into(tableName);
    });
};