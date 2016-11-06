exports.seed = function (knex, Promise) {
  let tableName = 'person';
  let rows = [
    { name: 'Tom Cruise', firstname: 'Tom', lastname: 'Cruise' },
    { name: 'Johnny Depp', firstname: 'Johnny', lastname: 'Depp' },
    { name: 'Leonardo DiCaprio', firstname: 'Leonardo', lastname: 'DiCaprio' },
    { name: 'Tom Hanks', firstname: 'Tom', lastname: 'Hanks' }
  ];

  return knex(tableName).del()
    .then(() => {
      return knex.insert(rows).into(tableName);
    });
};